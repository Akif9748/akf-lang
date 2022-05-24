const fs = require("fs");
const file = process.argv[2];
if (!file) return console.error("Example usage:", "node index.js first.akf");
if (!file.endsWith(".akf")) return console.error("Only works with *.akf files");

const interpreter = require("./src/interpreter");

fs.readFile(file, 'utf8', (err, content)=> {

    if (err) return console.error("Cant read file", "Set file name correctly.");

    if (!content) return;
    //Better reading for interpreter:
    interpreter(content)

});