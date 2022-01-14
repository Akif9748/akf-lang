const fs = require("fs");
const math = require('mathjs');

const file = process.argv[2];
if (!file) return console.error("Example usage:", "node index.js first.akf");
if (!file.endsWith(".akf")) return console.error("Only works with *.akf files");



fs.readFile(file, 'utf8', function (err, fileContent) {
    if (err) return console.error("Cant read file", "Set file name correctly.");
    if (!fileContent) return;
    const variables = {};
    const data = fileContent.replace(/\r/g, "");
    const lines = data.split("\n");

    for (const line of lines) {

        var args = line.split(" ");

        if (args[0] == "var") {
            if (args[1]) {
                const varName = args[1];
                if (args[2]) {
                    if (args[3] && Number(args[3])) {

                        variables[args[1]] = { value: args[3], type: "num" };

                    } else {


                        args.shift(); args.shift(); args.shift();

                        if (!isString(args.join(" "))) {
                            return error(lines.indexOf(line) + 1, 4, "Variable value is not a number");

                        } else {
                            variables[varName] = { value: args.join(" ").replace(/"/g, ""), type: "str" };

                        }
                    }
                } else {
                    return error(lines.indexOf(line) + 1, 3, "I cant found the '=' symbol");
                }
            } else {
                return error(lines.indexOf(line) + 1, 2, "Variable name is not defined");
            }

        } else if (args[0] == "math") {
            if (args[1]) {
                if (args[2]) {
                    const varName = args[1];

                    try {
                        args.shift(); args.shift(); args.shift();
                        var calc = args.join(" ")
                        for (const variable in variables) {
                            if (calc.includes(variable)) {
                                var calc = calc.replace(new RegExp(variable, "g"), variables[variable].value)
                            }
                        }
              
                        const resp = math.evaluate(calc);
                        if (!Number(resp)) throw "Result is not number";
                        variables[varName] = { value: resp, type: "num" };

                    } catch (e) {
                        return error(lines.indexOf(line) + 1, 2, "Math error:\n" + e);
                    }


                } else {
                    return error(lines.indexOf(line) + 1, 3, "I cant found the '=' symbol");
                }
            } else {
                return error(lines.indexOf(line) + 1, 2, "Variable name is not defined");
            }

        } else if (args[0] === "writeAdd") {

            if (args[1]) {
                args.shift();

                if (!Number(args[0])) {
                    //IS NOT STRING:
                    if (!isString(args.join(" "))) {
                        if (args[0] in variables === false) {
                            return error(lines.indexOf(line) + 1, 2, args[0] + " is not defined.");
                        } else {//WITH TYPE
                            process.stdout.write(variables[args[0]].value.toString());

                        }
                    } else {
                        process.stdout.write(args.join(" ").replace(/"/g, ""));
                    }
                } else {
                    process.stdout.write(Number(args[0]).toString());
                }


            } else {
                error(lines.indexOf(line) + 1, 2, "What can ı write to console?");
            }
        } else if (args[0] === "write") {

            if (args[1]) {
                args.shift();

                if (!Number(args[0])) {
                    //IS NOT STRING:
                    if (!isString(args.join(" "))) {
                        if (args[0] in variables === false) {
                            return error(lines.indexOf(line) + 1, 2, args[0] + " is not defined.");
                        } else {//WITH TYPE
                            console.log(variables[args[0]].value);

                        }
                    } else {
                        console.log(args.join(" ").replace(/"/g, ""));
                    }
                } else {
                    console.log(Number(args[0]));
                }


            } else {
                error(lines.indexOf(line) + 1, 2, "What can i write to console?");
            }
        }
    }



});
function isString(variable) {
    return variable.startsWith("\"") && variable.endsWith("\"");
}
function error(line, arg, err) {
    console.error("At line:", line, "\nAt arg:", arg, "\nAn error occured:\n", err);
    process.exit(0);
}
