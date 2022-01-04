var then = Date.now();
const fs = require("fs");
const wd = require("word-definition");
const formatPronounce = require("./word/pronounce.js");

(async () => {
  console.log("Compiling files");
  var main = fs.readFileSync(__dirname + "/src/main.md").toString();
  var style = fs.readFileSync(__dirname + "/src/style.css").toString();

  console.log("Formatting dictionary\n");

  var file = fs.readFileSync(__dirname + "/src/dictionary.md").toString();
  file = file.split("\r\n\r\n");

  // var alph = "btknvswliua";
  // var alph_eng = "abcdefghijklmnopqrstuvwxyz";
  var json = [];
  for (i in file) {
    entry = file[i].split("\r\n");
    if (entry && entry[0]) {
      var word = entry[0].toLowerCase().split(" - ");
      var refer = (word[1] || "").split(", ");
      word = word[0];

      /* var word_alph = "";
      for (j in word) {
        index = alph.indexOf(word[j]);
        word_alph += index || index === 0 ? alph_eng[index] : word[j];
      } */

      json.push({
        word,
        refer,
        word_alph: word,
        english: entry[1],
        type: entry[2],
        def: entry[3],
      });
    }
  }

  json.sort((a, b) => {
    if (a.word_alph < b.word_alph) {
      return -1;
    }
    if (a.word_alph > b.word_alph) {
      return 1;
    }
    return 0;
  });

  dict = [];
  for (i in json) {
    item = json[i];

    perc = (Math.floor((i / json.length) * 10000) / 100).toFixed(2);
    perc = " ".repeat(Math.max(0, 5 - perc.length)) + perc;
    fill = "ᐧ".repeat(Math.max(0, 12 - item.word.split("̄").join("").length));
    console.log(
      `${perc}%${fill} ${item.word || "?"} - ${
        item.english ? item.english.split(", ")[0] : "?"
      }`,
    );

    var ipa = formatPronounce(item.word);

    english = item.english;
    if (english) {
      english = english.split(", ");
      var temp = [];
      for (var i in english) {
        temp.push(
          "'" +
            english[i][0].toUpperCase() +
            english[i].slice(1).toLowerCase() +
            "'",
        );
      }
      english = temp.join(", ");
    } else {
      english = "[No English equivelent]";
    }

    def = item.def;
    // def = "TEST";
    if (!def) {
      def = "*[No Definition]*";
      if (item.english) {
        def_new = await new Promise(resolve => {
          timeout = setTimeout(() => resolve(null), 10000);
          wd.getDef(
            item.english.split(", ")[0].split(" ")[0].toLowerCase(),
            "en",
            null,
            function (definition) {
              resolve(definition);
              clearTimeout(timeout);
            },
          );
        });
        if (def_new && def_new.definition) {
          def = def_new.definition;
        }
      }
    } else {
      def = def[0].toUpperCase() + def.slice(1).toLowerCase();
    }

    type = item.type ? item.type.split(", ") : ["unknown"];
    type = type
      .map(item => {
        return "*" + item[0].toUpperCase() + item.slice(1).toLowerCase() + "*";
      })
      .join(", ");

    item.refer = !item.refer.join("")
      ? ""
      : item.refer
          .map(item => {
            return `[${item}](#${item})`;
          })
          .join(", ");

    dict.push(
      `## ${item.word.toLowerCase()}

Traditional: \`[${ipa.t}]\`

Simplified \`/${ipa.s}/\`

${type}${item.refer ? "\n\nSimilar: " + item.refer : ""}

**English:** ${english}

${def}

---`,
    );
  }

  console.log("\nFormatting Sentences");
  var sentences = fs
    .readFileSync(__dirname + "/src/sentences.md")
    .toString()
    .split("\r\n")
    .join("\n")
    .split("\n\n---\n\n");

  for (var i in sentences) {
    if (!sentences[i]) {
      continue;
    }
    var original = sentences[i].split("\n\n")[0];
    var structure = sentences[i].split("\n\n").slice(-2, -1)[0];
    var last = sentences[i].split("\n\n").slice(-1)[0].toLowerCase().split(" ");
    var ipa = { t: [], s: [] };
    for (var j in last) {
      var ipa_word = formatPronounce(last[j]);
      ipa.t.push(ipa_word.t);
      ipa.s.push(ipa_word.s);
    }
    ipa.t = ipa.t.join(" ");
    ipa.s = ipa.s.join(" ");
    last = last.join(" ");
    sentences[i] = `${original}

${last}

*Structure:* **${structure}**

*Traditional:* \`[${ipa.t}]\`

*Simplified:* \`/${ipa.s}/\``;
  }
  sentences = sentences.join("\n\n---\n\n");

  var footer =
    "\n\n### Created by [darcy](https://github.com/darccyy) (`/dɐːsi/` Satasi)\n\n<style>\n\n" +
    style +
    "\n\n</style>";

  console.log("Exporting README");
  fs.writeFileSync(
    __dirname + "/README.md",
    main +
      "\n\n# Example Sentences\n\n" +
      sentences +
      "\n\n---\n\n# Dictionary\n\n" +
      dict.join("\n\n") +
      footer,
  );

  console.log("Exporting Dictionary");
  fs.writeFileSync(
    __dirname + "/dictionary.md",
    "# Dictionary\n\n" + dict.join("\n\n") + footer,
  );

  console.log(`\nCompleted in ${(Date.now() - then) / 1000}s\n`);
  process.exit();
})();
