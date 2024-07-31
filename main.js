const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");
const { createDirectory } = require("./destinationFolder");
const fs = require("fs");
const JSZip = require("jszip");
const path = require('path')

const OUTPUT_DIR = "./Page_Craled_files";


const zipFolder = async (folderPath) => {
    const zip = new JSZip();
  
    const addFiles = (zip, folderPath) => {
      const files = fs.readdirSync(folderPath);
  
      files.forEach(fileName => {
        const filePath = path.join(folderPath, fileName);
        const stat = fs.statSync(filePath);
  
        if (stat.isDirectory()) {
          const folderZip = zip.folder(fileName);
          addFiles(folderZip, filePath);
        } else {
          zip.file(fileName, fs.readFileSync(filePath));
        }
      });
    };
  
    addFiles(zip, folderPath);
    return zip.generateAsync({ type: 'nodebuffer' })
  };


  const deleteFolder = (folderPath) => {
    // Ensure the path is absolute
    const absolutePath = path.resolve(folderPath);
  
    fs.rm(absolutePath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Error deleting folder: ${err.message}`);
      } else {
        console.log('Folder deleted successfully');
      }
    });
  };

// Main function to start the crawling process
async function main(req, res) {
  const { website } = req.query;
  console.log({ website });

  if (!website)
    return res.status(400).json({ message: "website link is not provided" });
  if (website) {
    process.argv[2] = website;
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
    //zip.generateAsync({ type: "nodebuffer" }).then((content) => {
     // fs.writeFileSync(`${OUTPUT_DIR}/archive.zip`, content);
      //console.log("Zip file saved.");
      
    //});

    const folderPath = path.join(__dirname, 'Page_Craled_files')
    const zipBuffer = await zipFolder(folderPath)
    deleteFolder(folderPath)

    res.setHeader('Content-Disposition', 'attachment; filename=output.zip');
    res.setHeader('Content-Type', 'application/zip');
    res.send(zipBuffer);
  }

  

  // Optionally, print the report
  printReport(pages); // Uncomment and define this function if needed
}

module.exports = { main };

// main()
