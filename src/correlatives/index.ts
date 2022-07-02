import fs from "fs";

const PREFIXES: string[][] = [
    ["ik", "Interrogative"],
    ["at", "Indication"],
    ["iv", "Indefinite"],
    ["af", "Universal"],
    ["nen", "Negative"],
    ["al", "Other"],
  ],
  SUFFIXES: string[][] = [
    ["a", "Quality"],
    ["al", "Reason"],
    ["am", "Time"],
    ["e", "Place"],
    ["en", "Motion"],
    ["il", "Manner"],
    ["o", "Thing"],
    ["ol", "Amount"],
    ["ulo", "Person"],
    ["u", "Single"],
    ["an", "Demonstrative"],
  ];

function createTable(prefixes = PREFIXES, suffixes = SUFFIXES) {
  var table: string[][] = [
    ["", ...prefixes.map(i => i[1])],
    "-".repeat(prefixes.length + 1).split(""),
  ];

  for (var s = 0; s < suffixes.length; s++) {
    var row: string[] = [suffixes[s][1]];
    for (var p = 0; p < prefixes.length; p++) {
      row.push(prefixes[p][0] + suffixes[s][0]);
    }
    table.push(row);
  }

  var rows: string[] = [];
  for (var i = 0; i < table.length; i++) {
    rows.push("|" + table[i].join("|") + "|");
  }

  return rows.join("\r\n") + "\r\n";
}

fs.writeFileSync(
  __dirname + "/table.md",
  createTable() +
    "\r\n" +
    createTable(
      PREFIXES.map(i => [
        "t" + ("iueoa".includes(i[0][0]) ? "" : "i") + i[0],
        i[1],
      ]),
    ),
);
console.log("Done.");
