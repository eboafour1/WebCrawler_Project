const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');
const {createDirectory} = require('./destinationFolder');
const fs = require('fs');
const JSZip = require('jszip');

const OUTPUT_DIR = './output';


// Main function to start the crawling process
 async function main(req,res) {
    const {website} = req.query
    console.log({website})
    
    if(!website) return res.status(400).json({message: 'website link is not provided'})
    if(website){
        process.argv[2] = website
    }
  createDirectory(); // Ensure the directory is created
  
  if (process.argv.length < 3) {
      console.log("No website provided");
      process.exit(1);
  }

  const baseURL = website || process.argv[2];
  console.log("Starting crawl");

  // Create a new zip instance if you want to use zip functionality
  const zip = new JSZip();

  // Start the crawl
  const pages = await crawlPage(baseURL, baseURL, {}, zip);

  // Save the zip file if needed
  if (Object.keys(pages).length > 0) {
      zip.generateAsync({ type: 'nodebuffer' })
          .then((content) => {
              fs.writeFileSync(`${OUTPUT_DIR}/archive.zip`, content);
              console.log('Zip file saved.');
          });
  }

  // Optionally, print the report
  printReport(pages); // Uncomment and define this function if needed
}

module.exports = {main}


// main()