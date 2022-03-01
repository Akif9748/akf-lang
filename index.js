const fs = require("fs");
const file = process.argv[2];
if (!file) return console.error("Example usage:", "node index.js first.akf");
if (!file.endsWith(".akf")) return console.error("Only works with *.akf files");

const interpreter = require("./src/interpreter");

fs.readFile(file, 'utf8', function (err, fileContent) {

    if (err) return console.error("Cant read file", "Set file name correctly.");

    if (!fileContent) return;
    //Better reading for interpreter:
    interpreter(fileContent.replace(/\r/g, ""))

});