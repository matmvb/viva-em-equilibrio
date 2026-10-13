var fs = require("fs");
var path = require("path");

var ORIGEM = __dirname;
var DESTINO = path.join(ORIGEM, "dist");
var ARQUIVOS = [
  "404.html",
  "favicon.svg",
  "index.html",
  "noscript.css",
  "og-image.png",
  "robots.txt",
  "script.js",
  "sitemap.xml",
  "styles.css",
  "_headers"
];

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.mkdirSync(DESTINO, { recursive: true });
ARQUIVOS.forEach(function (arquivo) {
  fs.copyFileSync(path.join(ORIGEM, arquivo), path.join(DESTINO, arquivo));
});
console.log("dist/ pronto com " + ARQUIVOS.length + " arquivos.");