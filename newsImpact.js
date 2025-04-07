function newsImpact(title, description) {
const impacto1 = [];

const impacto2 = [
  "tragedia",
  "tragédia",
  "catastrofe",
  "catástrofe",
  "gerra",
  "medo",
  "IA",
  "trend",
  "golpe",
  "EUA",
  "Estados Unidos",
  "greve",
  "assedi",
  "assédi",
  "crise",
  "preocupante",
  "militar",
  "incêncio",
  "incendio",
  "pertubad",
  "sobreviv",
  "ataque",
];

const impacto3 = [
  "Trump",
  "Bolsonaro",
  "Lula",
  "Musk",
  "Gates",
  "fogo",
  "teme",
  "bilh",
  "conden",
  "bilio",
  "destrui",
  "morte",
  "morre",
  "alarm",
  "assassin",
  "Zuckerberg",
];

    let rate = 1



    if (
      impacto3.some(
        (palavra) => title.includes(palavra) || description.includes(palavra)
      )
    ) {
      rate = 3;
    } else if (
      impacto2.some(
        (palavra) => title.includes(palavra) || description.includes(palavra)
      )
    ) {
      rate = 2;
    }

    return rate
}



window.newsImpact = newsImpact