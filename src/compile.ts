const then = Date.now();
import fs from "fs";
// import wd from "word-definition";
const F = require("fortissimo");

//TODO
console.log("\nFormatting dictionary... (???)");
const dictionary = "[empty...]";

//TODO
console.log("Formatting sentences... (???)");
const sentences = "[empty...]";

console.log("Compiling files...");
const main = fs.readFileSync(__dirname + "/main.md").toString();

fs.writeFileSync(
  __dirname + "/../README.md",
  main.replace("{DICTIONARY}", dictionary).replace("{SENTENCES}", sentences),
);

console.log(`Completed in ${F.parseTime(Date.now() - then)}\n`);
