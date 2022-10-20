const bcrypt = require("bcrypt");

async function generateHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return await bcrypt.hash(password, salt);
}

async function passwordIsMatch(input, hash) {
  return await bcrypt.compare(input, hash);
}

module.exports = {
  generateHash,
  passwordIsMatch
};
