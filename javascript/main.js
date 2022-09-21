const button = document.querySelector(".btn-download");

// cria uma <tag img> 'imagem'.
const createImg = () => document.createElement("img");

//pega todas as imagem e renderiza na page em arrays.
//a cada seleção será limpa e iniciada.
window.addEventListener("load", function () {
  let file = document.querySelector("#file");

  file.addEventListener("change", function () {
    const { files } = file;
    document.querySelector("#result").innerHTML = "";
    Array.from(files).forEach((image) => {
      let src = URL.createObjectURL(image);

      resizeImage(src, { width: 500 }).then(function (blob) {
        const resizedImg = createImg();
        resizedImg.src = URL.createObjectURL(blob);
        document.querySelector("#result").appendChild(resizedImg);
      });
    });
  });
});

//função faz com que a imagem seja escalada automaticamente para o novo tamanho.
function resizeImage(src, options) {
  return loadImage(document.createElement("img"), src).then(function (image) {
    let canvas = document.createElement("canvas");

    if (options.width && !options.height) {
      options.height = image.height * (options.width / image.width);
    } else if (!options.width && options.height) {
      options.width = image.width * (options.height / image.height);
    }

    Object.assign(canvas, options);

    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

    return new Promise(function (resolve) {
      canvas.toBlob(resolve, options.type || "image/png", options.quality);
    });
  });
}

//função que carrega as imagens e gera os downloads automaticos.
function downloadURI(uri, name) {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

//carrega a imagem completamente.
function loadImage(img, src) {
  return new Promise((resolve, reject) => {
    img.src = src;
    img.completed
      ? resolve(img)
      : img.addEventListener("load", function () {
          resolve(img);
        });
    img.addEventListener("error", reject);
  });
}

//botão que ira iniciar o download de N arquivos de imagens
button.addEventListener("click", () => {
  const images = document.querySelectorAll("#result img");
  images.forEach(({src}) => {
    downloadURI(src, 't1');
  });
});
