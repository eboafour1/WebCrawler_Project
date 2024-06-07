const fs = require('fs')
const path = require('path')
// create the destination folder if it doesn't exist
const OUTPUT_DIR = path.join(__dirname,'output')
//const OUTPUT_DIR = './output';


// Create the output directory if it doesn't exist
const createDirectory = () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`Directory created at ${OUTPUT_DIR}`);
  } else {
      console.log(`Directory already exists at ${OUTPUT_DIR}`);
  }
};

// Write content to a file in the output directory
const writeToDirectory = (content, filename) => {
  // console.log({ content, filename });
  const filePath = path.join(OUTPUT_DIR, filename);
  try {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`File written to ${filePath}`);
  } catch (error) {
      console.error(`Error writing file to ${filePath}: ${error.message}`);
  }
};

module.exports={
  createDirectory,
  writeToDirectory
}