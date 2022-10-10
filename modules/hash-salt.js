const bcrypt = require("bcrypt");

const userDao = require("../modules/users-dao.js");

async function generateHash(password, salt){
    return await bcrypt.hash(password, salt);
}

function generateSalt(){
    return bcrypt.genSaltSync(10);
}

async function passwordIsMatch(input, hash){

    return await bcrypt.compare(input, hash);
}

module.exports = {
    generateHash,
    generateSalt,
    passwordIsMatch
}