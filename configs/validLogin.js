const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(5);

function hashPassword(password){
    const hashedPass = bcrypt.hashSync(password, salt);
    return hashedPass;
}

function comparePassword(password, hashedPassword){
    const comparedPassword = bcrypt.compareSync(password, hashedPassword);
    return comparedPassword;
}

module.exports = {hashPassword, comparePassword}