const rl = require('readline');

module.exports = new Promise(r => rl.createInterface(process.stdin).on('line', r));