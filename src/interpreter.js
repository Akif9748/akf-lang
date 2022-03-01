const fs = require("fs");

//MAIN VARIABLES:
const variables = { "PI": { value: 3.14, type: "num" } };

/**
 * Main function for interpreter
 * @param {String} data Data input in Akf-lang standarts.
 * @returns {void} Running.
 */
function main(data) {
    const lines = data.split("\n");
    let index = 1;
    for (const line of lines) {

        const args = line.split(" ");

        if (args[0] === "take") {
            if (args[1]) {
                try {

                    main(fs.readFileSync(args[1], "utf8"));

                } catch (e) {

                    error(index, "<anonymous> (In take function)", e.name)
                }

            } else
                error(index, 2, "File name is not defined");


        }
        if (args[0] === "var") {
            if (args[1]) {
                if (args[2]) {
                    if (args[3]) {
                        const tip = type(args.slice(3).join(" "))
                        if (!tip)
                            return error(index, 4, "Variable value is illegal");
                        variables[args[1]] = tip;

                    } else
                        error(index, 4, "Variable value is empty");

                } else
                    error(index, 3, "I cant found the '=' symbol");

            } else
                error(index, 2, "Variable name is not defined");


        } else if (args[0] === "write") {

            if (args[1]) {
                const tip = type(args.slice(1).join(" "));

                if (!tip)
                    return error(index, 2, "Value for write is illegal");

                process.stdout.write(tip.value.toString());

            } else
                error(index, 2, "What can i write to console?");

        } else if (args[0] === "writeln") {

            if (args[1]) {

                const tip = type(args.slice(1).join(" "));

                if (!tip)
                    return error(index, 2, "Value for write is illegal");

                console.log(tip.value);

            } else
                error(index, 2, "What can i write to console?");

        } else if (args[0] === "plus") {
            if (args[1]) {
                if (args[2]) {
                    if (args[3]) {
                        const numbers = parse(args.slice(3).join(" "));

                        if (!numbers[0]) error(index, 2, "Numbers are missing");

                        if (numbers.some(num => type(num).value == "num"))
                            error(index, 2, "Variables are not number");

                        const total = numbers.reduce((a, b) => a + Number(type(b).value), 0);

                        variables[args[1]] = { value: total, type: "num" };

                    } else
                        return error(index, 4, "Numbers are empty");

                } else
                    return error(index, 3, "I cant found the '=' symbol");
            } else
                error(index, 2, "Variable name is missing");


        }

        else if (args[0] === "multi") {
            if (args[1]) {
                if (args[2]) {
                    if (args[3]) {
                        const numbers = parse(args.slice(3).join(" "));

                        if (!numbers[0]) error(index, 2, "Numbers are missing");

                        if (numbers.some(num => type(num).value == "num"))
                            error(index, 2, "Variables are not number");

                        const value = numbers.reduce((a, b) => Number(type(a).value) * Number(type(b).value));

                        variables[args[1]] = { value, type: "num" };

                    } else
                        return error(index, 4, "Numbers are empty");

                } else
                    return error(index, 3, "I cant found the '=' symbol");
            } else
                error(index, 2, "Variable name is missing");


        }

        else if (args[0] === "less") {
            if (args[1]) {
                if (args[2]) {
                    if (args[3]) {
                        const numbers = parse(args.slice(3).join(" "));

                        if (!numbers[0] || !numbers[1]) error(index, 2, "Numbers are missing");

                        if (numbers.some(num => type(num).value == "num"))
                            error(index, 2, "Variables are not number");

                        const value = type(numbers[0]).value - type(numbers[1]).value

                        variables[args[1]] = { value, type: "num" };

                    } else
                        error(index, 4, "Numbers are empty");

                } else
                    error(index, 3, "I cant found the '=' symbol");
            } else
                error(index, 2, "Variable name is missing");


        }


        else if (args[0] === "div") {
            if (args[1]) {
                if (args[2]) {
                    if (args[3]) {
                        const numbers = parse(args.slice(3).join(" "));

                        if (!numbers[0] || !numbers[1]) error(index, 2, "Numbers are missing");

                        if (numbers.some(num => type(num).value == "num"))
                            error(index, 2, "Variables are not number");

                        const value = type(numbers[0]).value / type(numbers[1]).value

                        variables[args[1]] = { value, type: "num" };

                    } else
                        error(index, 4, "Numbers are empty");

                } else
                    error(index, 3, "I cant found the '=' symbol");
            } else
                error(index, 2, "Variable name is missing");


        }
        index++
        //MAIN FOR LOOP END
    }
}


/**
 * FUNCTIONS:
 * 
 */
//Parsing for ();
function parse(str) {
    return str.slice(str.indexOf("(") + 1, str.lastIndexOf(")")).split(",")
}

//Type of a variable:
function type(value) {

    let deger = null, tip = "null";

    if (Number(value)) {
        deger = Number(value);
        tip = "num";
    } else if (isString(value)) {
        deger = value.slice(value.indexOf("\"") + 1, value.lastIndexOf("\""));
        tip = "str";
    }
    else if (value.trim() === "true") {
        deger = true;
        tip = "bool";
    }
    else if (value.trim() === "false") {
        deger = false;
        tip = "bool";
    } else if (value in variables) {
        const variable = variables[value];
        deger = variable.value;
        tip = variable.type;
    }

    return new Type(deger, tip);

}

//Is string?
function isString(variable) {
    return variable.startsWith("\"") && variable.endsWith("\"");
}

//Error:
function error(line = Number, arg = Number, err = String) {

    console.error(`Line: ${line}, arg: ${arg}, an error occured:\n${err}`);
    process.exit(0);
}

//Class for types:
class Type {
    constructor(value = null, type = "null") {
        this.value = value;
        this.type = type;
    }
}

/**
 * MAIN FUNCTION IMPORTING:
 */
module.exports = main;