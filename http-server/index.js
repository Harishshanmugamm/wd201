const http = require("http");
const fs = require("fs");
const z = require("minimist");
const fmz=z(process.argv.slice(2))


let homepage = "";
let projectpage = "";
let regpage = "";

fs.readFile("home.html", (err, h) => {
  if (err) throw err;
  
  homepage = h;
});

fs.readFile("project.html", (err, pro) => {
  if (err)  throw err;
  
  projectpage = pro;
});
fs.readFile("registration.html", (err, registration) => {
  if (err) throw err;
  regpage = registration;
});

http
  .createServer((req, res) => {
    let link = req.url;
    res.writeHeader(200, { "Content-type": "text/html" });
    switch (link) {
      case "/project":
        res.write(projectpage);
        res.end();
        break;
      case "/registration":
        res.write(regpage);
        res.end();
        break;
      default:
        res.write(homepage);
        res.end();
        break;
    }
  }).listen(fmz.port);

