function init() {
  $("#words").html(new Array(20).fill(null).map(generateWord).join("<br />"));
}

// Letter classes
const letters = "abcdefgijklmnopstuvwz"; // All letters
const consonants = "pbtdkgmnfvszcwjl".split(""); // All consonants
const slides = "sc"; // s-like
const slideValids = "ptkfwl"; // Consonants compatible with slides before
const semivowels = "wj"; // Diphthong-final semivowels
const noSemivowels = "pbtdkgmnfvszcl"; // Consonants except w,j
const coda = "nml"; // Coda consonants (Nasals + l)
const vowels = "i,u,e,o,a,ej,aj,oj,aw".split(",");
const suffixes = "i,u,e,o,a,on,ojn,en,is,as,os,us".split(","); // PoS suffixes

function generateWord() {
  // Any letter (Initial syllable)
  var word = F.randomChoice(letters);

  for (var i = 0; i < F.randomInt(1, 4); i++) {
    // Possibly add slide if was vowel (Not word-initial)
    if (i && vowels.includes(lastPhoneme(word)) && randomPass()) {
      word += F.randomChoice(slides);
    }
    // Possibly add slide-valid consonant if was slide
    if (slides.includes(lastPhoneme(word)) && randomPass()) {
      word += F.randomChoice(slideValids);
    }
    // Must add vowel if was consonant
    if (consonants.includes(lastPhoneme(word))) {
      word += F.randomChoice(removeSimilarVowels(vowels, lastPhoneme(word)));
    }
    // Possibly add coda
    if (randomPass()) {
      word += F.randomChoice(coda);
    }
  }

  // Add consonant if was vowel
  if (vowels.includes(lastPhoneme(word))) {
    word += F.randomChoice(noSemivowels);
  }

  // Add suffix
  return word + F.randomChoice(suffixes);
}

// Remove w/j if phoneme is u/i respectively
function removeSimilarVowels(vowels, consonant) {
  if (consonant === "w") {
    return vowels.filter(i => i?.[0] !== "u");
  }
  if (consonant === "j") {
    return vowels.filter(i => i?.[0] !== "i");
  }
  return vowels;
}

// Get last phoneme of string
function lastPhoneme(string) {
  // Check for diphthong
  if (
    semivowels.includes(string.slice(-1)[0]) &&
    vowels.includes(string.slice(-2)[0])
  ) {
    return string.slice(-2);
  }
  return string.slice(-1);
}

// Random equal chance true or false
function randomPass() {
  return Math.random() < 0.5;
}
