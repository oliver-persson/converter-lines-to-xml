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
  phone?: string;
  address?: Address;
}
interface Person {
  firstname?: string; // is required?
  lastname?: string; // is required?
  phone?: string;
  address?: string;
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
