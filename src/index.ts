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

// Function for transforming line into person objects
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
        // Error When person is missing
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
        // Error when person is missing
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
        // Error when person is missing
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

// Function for building XML
function buildXml(people: Person[]): string {
  const root = create({ version: "1.0" }).ele("people");

  for (const p of people) {
    // New pperson node
    const personNode = root.ele("person");
    // Person name
    personNode.ele("firstname").txt(p.firstname || "");
    personNode.ele("lastname").txt(p.lastname || "");

    // Person address
    if (p.address) {
      const a = personNode.ele("address");
      if (p.address.street) a.ele("street").txt(p.address.street);
      if (p.address.city) a.ele("city").txt(p.address.city);
      if (p.address.postal) a.ele("postalnumber").txt(p.address.postal);
    }

    // Person phone
    if (p.phone && (p.phone.mobile || p.phone.telephone)) {
      const t = personNode.ele("phone");
      if (p.phone.mobile) t.ele("mobile").txt(p.phone.mobile);
      if (p.phone.telephone) t.ele("telephone").txt(p.phone.telephone);
    }

    for (const f of p.family) {
      // New family node
      const famNode = personNode.ele("family");
      // Family name
      famNode.ele("name").txt(f.name || "");
      famNode.ele("born").txt(f.born || "");

      // Family address
      if (f.address) {
        const a = famNode.ele("address");
        if (f.address.street) a.ele("street").txt(f.address.street);
        if (f.address.city) a.ele("city").txt(f.address.city);
        if (f.address.postal) a.ele("postalnumber").txt(f.address.postal);
      }

      // Family phone
      if (f.phone && (f.phone.mobile || f.phone.telephone)) {
        const t = famNode.ele("phone");
        if (f.phone.mobile) t.ele("mobile").txt(f.phone.mobile);
        if (f.phone.telephone) t.ele("telephone").txt(f.phone.telephone);
      }
    }
  }

  return root.end({ prettyPrint: true }); // XML with line breaks and indentation
}

// Read data and create XML file
const people = createPeople(lines);
const xml = buildXml(people);
fs.writeFileSync(outputPath, xml, "utf8");
console.log(`XML created: ${outputPath}`);
