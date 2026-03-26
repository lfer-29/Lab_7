const bcrypt = require('bcrypt');
const fs = require('fs'); 
const password = process.argv[2];
var hash = bcrypt.hashSync(`${password}`, bcrypt.genSaltSync(10));


fs.writeFileSync("password.txt", hash)