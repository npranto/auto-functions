const fs = require("fs");
const path = require("path");

const writeToFile = (path, content) => {
  try {
    fs.writeFileSync(path, content);
  } catch (error) {
    throw error;
  }
};

module.exports = writeToFile;
