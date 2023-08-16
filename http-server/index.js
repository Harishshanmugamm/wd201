/*const http=require("http")
const fs=require("fs")

let m = http.createServer((req,res)=>{
   const st=fs.createReadStream("simple.txt")
   st.pipe(res)
   /* fs.readFile("simple.txt",(err,ok)=>{
        if (err) throw err;
        console.log(res.end(ok))
    })
})
m.listen(3050)*/
/*const cd=require("readline")
const done=cd.createInterface({input:process.stdin,output:process.stdout
})
done.question("Provide me your name is ",(name)=>{
    console.log(`Hi ${name}`)
    done.close()
})*/
//const np=require("minimist") //(process.argv.slice(2))
//console.log(np)

/*let args = np(process.argv.slice(2), {
    alias: {
      n: "name",
      a: "age",
    },
   });
   console.log(args)*/

/*let args = np(process.argv.slice(2), {
    default: {
      greeting: "Hello",
    },
   });
   console.log(args)*/

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
    res.writeHeader(600, { "Content-type": "text/html" });
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

