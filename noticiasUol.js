const rssUolCategory = [
  "uol.com.br/tilt",
  "economia.uol.com.br",
  "noticias.uol.com.br",
];
const proxy = "https://api.allorigins.win/raw?url=";
let todasNoticiasUolO = [];
const cacheKey = "xmlNoticiasCache";
const cacheTimeKey = "xmlNoticiasCacheTime";
const cacheDuration = 360000; // 1 hora em milissegundos

const rssFeedsUol = [
  "http://rss.uol.com.br/feed/economia.xml",
  "https://rss.uol.com.br/feed/tecnologia.xml",
  "https://rss.uol.com.br/feed/comecar-o-dia.xml",
];

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
];

async function fetchXML(rssUrl) {
  const apiURL = proxy + encodeURIComponent(rssUrl);
  try {
    const response = await fetch(apiURL);
    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder("iso-8859-1");
    return decoder.decode(buffer);
  } catch (error) {
    console.error("Erro ao carregar o feed:", error);
    return null;
  }
}

async function carregarNoticias() {
  const cacheTime = localStorage.getItem(cacheTimeKey);
  const now = Date.now();

  // Só usa o cache se cacheDuration for maior que zero
  if (cacheDuration > 0 && cacheTime && now - cacheTime < cacheDuration) {
    const cachedXML = JSON.parse(localStorage.getItem(cacheKey));
    if (cachedXML) {
      todasNoticiasUolO = processXMLs(cachedXML);
      console.log("Usando cache");
      // exibirNoticias();
      return;
    }
  }

  let xmlDataList = [];
  for (let feed of rssFeedsUol) {
    const xmlData = await fetchXML(feed);
    if (xmlData) xmlDataList.push(xmlData);
  }

  if (xmlDataList.length > 0) {
    localStorage.setItem(cacheKey, JSON.stringify(xmlDataList));
    localStorage.setItem(cacheTimeKey, now);
    todasNoticiasUolO = processXMLs(xmlDataList);
    console.log("Cache atualizado");
  }

  exibirNoticias();
}

function processXMLs(xmlDataList) {
  let todasNoticiasTempUol = [];
  xmlDataList.forEach((xmlData) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlData, "text/xml");
    const items = xml.querySelectorAll("item");

    items.forEach((item) => {
      let title = item.querySelector("title")?.textContent || "Sem título";
      let description =
        item.querySelector("description")?.textContent || "Sem descrição";
      let link = item.querySelector("link")?.textContent || "Sem link";
      let pubDate = item.querySelector("pubDate")?.textContent || "Sem data";
      let match = description.match(/<img\s+[^>]*src=['"]([^'"]+)['"]/i);
      let thumbnail = match
        ? match[1]
        : "https://conteudo.imguol.com.br/c/home/interacao/facebook/compartilhe.png";

      let category = "";
      if (link.includes(rssUolCategory[0])) {
        category = "Tecnologia";
      } else if (link.includes(rssUolCategory[1])) {
        category = "Economia";
      } else if (link.includes(rssUolCategory[2])) {
        category = "Mundo";
      }

      let impact = newsImpact(title, description);
      /*
let impact = 1

if (
            impacto3.some(
              (palavra) =>
                titulo.includes(palavra) || description.includes(palavra)
            )
          ) {
            impact = 3;
          }else if(
            impacto2.some(
              (palavra) =>
              titulo.includes(palavra) || description.includes(palavra)
            )
          ){
            impact = 2;
          }
          */

      todasNoticiasTempUol.push({
        title,
        description,
        link,
        thumbnail,
        pubDate,
        category,
        impact,
      });
    });
  });
  globalThis.todasNoticiasTempUol = todasNoticiasTempUol

  console.log("OUL")
  console.log(todasNoticiasTempUol)
  return todasNoticiasTempUol.sort(
    (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
  );
}



/*
function exibirNoticias() {
  let jsonShow = document.getElementById("feed");
  jsonShow.innerHTML = "";
  todasNoticiasUolO.forEach((noticia) => {
    let descriptionCorrigida = noticia.description.replace(/<img[^>]*>/g, "");
    jsonShow.innerHTML += `<img src='${noticia.thumbnail}'><br>`;
    jsonShow.innerHTML += `<a href='${noticia.link}'><b>${noticia.titulo}, ${noticia.category}, ${noticia.impact}</b></a><br>`;
    jsonShow.innerHTML += descriptionCorrigida + "<br>";
    jsonShow.innerHTML += noticia.pubDate + "<br>";
  });
  

}*/

carregarNoticias();
if (cacheDuration > 0) {
  setInterval(carregarNoticias, cacheDuration);
}
