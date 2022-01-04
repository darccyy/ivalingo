var word = "";
var valid = "";

function init() {
  randomWord();
}

function input(e) {
  if (e.key === "Enter") {
    randomWord();
  } else if (e.key === "Backspace") {
    if (e.ctrlKey) {
      word = "";
    } else {
      word = word.slice(0, -1);
    }
  } else if (!e.altKey && !e.metaKey && e.key.length === 1) {
    if (e.ctrlKey) {
      if (e.key === "c") {
        copy();
      } else if (e.key === "x") {
        clearWord();
      }
    } else {
      addLetter(e.key.toLowerCase());
    }
  }
  change();
}
addEventListener("keydown", input);

function change() {
  getValid();
  word = word.slice(0, 50);
  $("#word").text("");
  if (word) {
    $("#word").text(word);
  }
  $("#last").text("");
  if (!"iuan".includes(word.slice(-1))) {
    if (word.slice(-1)[0] === "w") {
      $("#last").text("u");
    } else {
      $("#last").text("a");
    }
  }

  var ipa = formatPronounce($("#word").text() + $("#last").text());
  $("#ipa_t").text(ipa.t || " ");
  $("#ipa_s").text(ipa.s || " ");
}

function maxLength(text) {
  var split = text.split(/[iua]/);
  if (split.length > 3) {
    return text.slice(
      0,
      split
        .slice(
          0,
          3 + (text.startsWith("sa") && !text.startsWith("san") ? 1 : 0),
        )
        .join("_").length +
        (split.slice(-1)[0][0] === "n" ? 1 : 0) +
        1,
    );
  }
  return text;
}

function addLetter(letter) {
  getValid();
  if (valid.includes(letter)) {
    word += letter;
  } else if ("iua".includes(letter) && letter === word.slice(-1)) {
    if (valid.includes("-")) {
      word += "-";
    }
  }
  word = maxLength(word);
}

function getValid() {
  temp = "";
  if (word.length === 0) {
    // Start of word
    temp = "btvskwl"; // Consonants
  } else {
    if ("iua".includes(word.slice(-1))) {
      // Vowels
      temp += "btvskwln"; // Consonants, Nasal
    } else if ("vwl".includes(word.slice(-1))) {
      // Consonants (Not Cwu compatible)
      temp += "iua"; // Vowels
    } else if ("btsk".includes(word.slice(-1))) {
      // Consonants (Cwu compatible)
      temp += "iua"; // Vowels
      if (word.split(/[btvskl]+w/).length < 2) {
        temp += "w"; // W
      }
    } else if ("n".includes(word.slice(-1))) {
      // Nasals
      temp += "btvskwl"; // Consonants
    }
  }

  valid = "";
  for (var i in temp) {
    // Cannot be over limit
    if (maxLength(word + temp[i]).length === word.length + 1) {
      // Vowel harmomy
      if (
        !(temp[i] === "i" && word.includes("u")) &&
        !(temp[i] === "u" && word.includes("i"))
      ) {
        valid += temp[i];
      }
    }
  }

  showValid();
}

function showValid() {
  cols = {
    consonant: "",
    vowel: "",
    nasal: "",
    unknown: "",
  };
  types = {
    consonant: "btvskwl",
    vowel: "iua",
    nasal: "n",
  };

  valid.split("").forEach(i => {
    var type = "unknown";
    for (j in types) {
      if (types[j].includes(i)) {
        type = j;
      }
    }

    if (type) {
      cols[type] += `
        <li class="${type}">
          ${i}
        </li>
      `;
    }
  });

  str = "";
  for (i in cols) {
    str += cols[i]
      ? `
      <ul>
        ${cols[i]}
      </ul>
      `
      : "";
  }
  $(`#valid`).html(str);
}

function randomWord() {
  word = "";
  length = F.randomInt(4, 10);
  for (var i = 0; i < length; i++) {
    addLetter(F.randomChoice(valid));
    change();
  }
  word += $("#last").text() || "";
  change();
}

function copy() {
  F.copy($("#word").text() + $("#last").text());
}

function clearWord() {
  word = "";
  change();
}
