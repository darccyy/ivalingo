function formatPronounce(text) {
  var replace = [",", ".", "'", '"', "!", "¡", "?", "¿"];
  for (var i in replace) {
    text = text.split(replace[i]).join("");
  }

  return "???";

  var syllables = [];
  var current = "";
  for (var i = 0; i < text.length; i++) {
    if (!"iuan".includes(text[i])) {
      if (text[i] !== "w" || "iuan".includes(text[i - 1])) {
        if (current) {
          syllables.push(current);
        }
        current = "";
      }
    }
    current += text[i];
  }
  syllables.push(current);

  if (syllables.length >= 2) {
    text = syllables.slice(0, -2).join("") + "ˈ" + syllables.slice(-2).join("");
  }

  var ipa = { t: text, s: text };
  var replace_t = {
    wi: "wiː",
    in: "ɪ̃n",

    wu: "wuː",
    un: "ũn",
    u: "ʊ",

    wa: "waː",
    an: "ãn",
    a: "ɐ",

    n: "ɳ",
    ɳs: "ns",
    ɳˈs: "nˈs",
    ɳˌs: "nˌs",
    ɳv: "nv",
    ɳˈv: "nˈv",
    ɳˌv: "nˌv",

    ɳb: "mb",
    ɳˈb: "mˈb",
    ɳˌb: "mˌb",

    t: "ɽ",
    ɳɽ: "ɳʈ",
    ɳˈɽ: "ɳˈʈ",
    ɳˌɽ: "ɳˌʈ",

    v: "ⱱ",
    ɳⱱ: "ɳv",
    ɳˈⱱ: "ɳˈv",
    ɳˌⱱ: "ɳˌv",

    l: "ɭ",
  };
  var replace_s = {};
  for (var i in replace_t) {
    ipa.t = ipa.t.split(i).join(replace_t[i]);
  }
  for (var i in replace_s) {
    ipa.s = ipa.s.split(i).join(replace_s[i]);
  }

  return ipa;
}

try {
  module.exports = formatPronounce;
} catch {}
