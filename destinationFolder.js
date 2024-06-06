const fs = require('fs')
const path = require('path')
// create the destination folder if it doesn't exist
const OUTPUT_DIR = path.join(__dirname,'output')

const creatDirectory=()=>{
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
}

const writeToDirectory=(content,filename)=>{
  console.log({content,filename})
  const filePath = path.join(OUTPUT_DIR,filename)
  fs.writeFileSync(filePath,content,'utf-8')

}

module.exports={
  creatDirectory,
  writeToDirectory
}