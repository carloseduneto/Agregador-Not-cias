async function carregarRSSGiz(url) {
  // Usando o AllOrigins para contornar o CORS
  const proxy = "https://api.allorigins.win/raw?url=";

  try {
    // Requisição que retorna um ArrayBuffer (bytes brutos)
    const response = await fetch(proxy + encodeURIComponent(url));
    const buffer = await response.arrayBuffer();

    // Decodifica os bytes usando a codificação iso-8859-1
    const decoder = new TextDecoder("iso-8859-1");
    const text = decoder.decode(buffer);

    // Faz o parsing do XML
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    // Extração dos itens do feed
    const items = xml.querySelectorAll("item");
    let noticiasUol = [];

    function corrigirTexto(texto) {
      const mapaCaracteres = {
        "Ã£": "ã",
        "Ã¡": "á",
        "Ã¢": "â",
        "Ã¤": "ä",
        Ãª: "ê",
        "Ã©": "é",
        "Ã¨": "è",
        "Ã«": "ë",
        "Ã­": "í",
        "Ã®": "î",
        "Ã¯": "ï",
        "Ã³": "ó",
        "Ã´": "ô",
        "Ã¶": "ö",
        "Ã¹": "ù",
        Ãº: "ú",
        "Ã¼": "ü",
        "Ã§": "ç",
        "Ã±": "ñ",
        "â€”": "—",
        "â€“": "–",
        "â€œ": "“",
        "â€�": "”",
        "â€˜": "‘",
        "â€™": "’",
        "â€¦": "…",
        "Â°": "°",
        "Â£": "£",
        "Â¥": "¥",
        "â‚¬": "€",
        "â„¢": "™",
        "âˆž": "∞",
        "Ãµ": "õ",
        "Âª": "ª",
        "Ã": "à",
        'Â': ""
      };

      let textoCorrigido = texto;

      for (const [errado, certo] of Object.entries(mapaCaracteres)) {
        textoCorrigido = textoCorrigido.replace(new RegExp(errado, "g"), certo);
      }

      return textoCorrigido;
    }

    items.forEach((item) => {
      let title = item.querySelector("title")?.textContent || "Sem título";
      title = corrigirTexto(title)

      let description = item.querySelector("description")?.textContent || "Sem descrição";
      description = corrigirTexto(description)

      let link = item.querySelector("link")?.textContent || "Sem descrição";
      let pubDate = item.querySelector("pubDate")?.textContent || "Sem descrição";
       
      

      let match = description.match(/<img\s+[^>]*src=['"]([^'"]+)['"]/i);

      let thumbnail = match ? match[1] : null;

      if(thumbnail == null){
        thumbnail =
          "https://bpb-us-w2.wpmucdn.com/web.sas.upenn.edu/dist/9/312/files/2023/06/gizmodo-1080x675.png";


        }
        let category = item.querySelector("category")?.textContent || "Sem categoria"
        category = corrigirTexto(category)

      console.log(thumbnail);

      noticiasUol.push({ title, description, link, thumbnail, pubDate, category});
    });

    globalThis.noticiasUol = noticiasUol;
    // Exibe os resultados no console
   /*
    let jsonShow = document.getElementById("feed");

    for (let noticia1 of noticiasUol) {
      var descriptionCorrigida = noticia1.description;
      descriptionCorrigida = descriptionCorrigida.replace(/<img[^>]*>/g, "");
      jsonShow.innerHTML += `<img src='${noticia1.thumbnail}'><br>`;
      jsonShow.innerHTML += `<a href='${noticia1.link}'><b>${noticia1.title}</b></a><br>`;
      jsonShow.innerHTML += descriptionCorrigida + "<br>";
    }*/

    console.log(noticiasUol);
  } catch (error) {
    console.error("Erro ao carregar RSS:", error);
  }
}

// Chame a função com o feed do UOL
carregarRSSGiz("https://gizmodo.uol.com.br/feed/");
