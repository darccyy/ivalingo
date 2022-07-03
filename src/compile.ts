const then = Date.now();
import fs from "fs";
import wd from "word-definition";
const F = require("fortissimo");

async function main() {
  // Read file
  console.log("\nFetching definitions...");
  const file = fs
    .readFileSync(__dirname + "/dictionary.md")
    .toString()
    .split("\r\n\r\n");
  const entries: any[] = [];
  for (var i = 0; i < file.length; i++) {
    var [word, pos, trans, def] = file[i].split(/\r\n-? */g);
    var eo = trans.split(";")[0].split(",") || null;
    var en = trans.split(";")[1].split(",") || null;

    console.log(" -", word);
    if (word) {
      entries.push({
        word,
        pos,
        eo,
        en,
        def: def || (await getDefOfArray(en)) || null,
      });
    }
  }

  // Sort entries
  console.log("Formatting dictionary...");
  entries.sort((a, b) => {
    if (a.word < b.word) {
      return -1;
    }
    if (a.word > b.word) {
      return 1;
    }
    return 0;
  });
  // Format dictionary
  const dictionary: string[] = [];
  for (var i = 0; i < entries.length; i++) {
    const { word, pos, eo, en, def } = entries[i];
    dictionary.push(
      [
        `## ${word}`,
        `*${pos || "*[unknown]*"}*`,
        `\`eo\` *${eo ? eo.join("*, *") : "[unknown]"}*`,
        `\`en\` *${en ? en.join("*, *") : "*[unknown]*"}*`,
        `${def || "**[unknown]**"}`,
        `---`,
      ].join("\r\n\n"),
    );
  }

  //TODO Sentences
  console.log("Formatting sentences... (???)");
  const sentences = "[empty...]";

  // Compile
  console.log("Compiling files...");
  const main = fs.readFileSync(__dirname + "/main.md").toString();
  fs.writeFileSync(
    __dirname + "/../README.md",
    main
      .replace("{DICTIONARY}", dictionary.join("\r\n\r\n"))
      .replace("{SENTENCES}", sentences),
  );

  console.log(`Completed in ${F.parseTime(Date.now() - then)}\n`);
}
main();

// Get definition of english word
function getDefOfArray(array: string[]) {
  return new Promise<string | null>(async resolve => {
    for (var i = 0; i < array.length; i++) {
      console.log(" - -", array[i]);
      var def = await getDefOfWord(array[i]);
      if (def) {
        resolve(def);
        return;
      }
    }
    resolve(null);
  });
}

function getDefOfWord(word: string) {
  return new Promise<string | null>(async resolve => {
    wd.getDef(word, "en", null, (def: any) => {
      resolve(def?.definition || null);
    });
  });
}
