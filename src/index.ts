import fs from "fs";
import { create } from "xmlbuilder2";

// Types
interface Phone {
  mobile?: string;
  telephone?: string;
}
interface Address {
  street?: string;
  city?: string;
  postal?: string;
}
interface Family {
  name?: string;
  born?: string;
  phone?: Phone;
  address?: Address;
}
interface Person {
  firstname?: string; // is required?
  lastname?: string; // is required?
  phone?: Phone;
  address?: Address;
  family: Family[];
}

// Input/output sources
const inputPath = "input.txt";
const outputPath = "output.xml";

// Error if input file does not exist
if (!fs.existsSync(inputPath)) {
  console.error(`Missing input file "${inputPath}"`);
  process.exit(1);
}

// Split lines into array
const lines = fs.readFileSync(inputPath, "utf8").split("\n");
//.map(line => line.trim()); // trim whitespaces?

// Make people objects
function createPeople(lines: string[]): Person[] {
  const persons: Person[] = [];
  let currentPerson: Person | null = null;
  let currentFamily: Family | null = null;

  for (const line of lines) {
    const parts: string[] = line.split("|");
    const type: string = parts[0];

    switch (type) {
      // P|firstname|lastname
      case "P": {
        if (currentPerson) persons.push(currentPerson); // push person because a new person is coming

        currentPerson = {
          firstname: parts[1],
          lastname: parts[2],
          family: [],
        };

        // Display error when person data is missing
        if (!currentPerson.firstname || !currentPerson.lastname) {
          console.warn(`Person missing firstname/lastname: "${line}"`);
        }

        currentFamily = null;
        break;
      }

      // T|mobile|telephone
      case "T": {
        // Display error When person is missing
        if (!currentPerson) {
          console.warn(`T-line without active person: "${line}"`);
          continue;
        }

        const phone: Phone = { mobile: parts[1], telephone: parts[2] };
        if (currentFamily) currentFamily.phone = phone;
        else currentPerson.phone = phone;
        break;
      }

      // A|street|city|postalnumber
      case "A": {
        // Display error when person is missing
        if (!currentPerson) {
          console.warn(`A-line without active person: "${line}"`);
          continue;
        }
        const address: Address = {
          street: parts[1],
          city: parts[2],
          postal: parts[3],
        };
        if (currentFamily) currentFamily.address = address;
        else currentPerson.address = address;
        break;
      }

      // F|name|year
      case "F": {
        // Display error when person is missing
        if (!currentPerson) {
          console.warn(`F-line without active person: "${line}"`);
          continue;
        }
        currentFamily = { name: parts[1], born: parts[2] };
        currentPerson.family.push(currentFamily);
        break;
      }

      default:
        console.warn(`Unknown line type: "${line}"`);
    }
  }

  if (currentPerson) persons.push(currentPerson); // push final person

  return persons;
}

const people = createPeople(lines);
console.log(people);
