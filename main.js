const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');
const {downloadPage} = require('./downloadPage');
const {creatDirectory} = require('./destinationFolder');
const fs = require('fs');
const ZipStream = require('zip-stream');
const cheerio = require('cheerio');



const https = require('https');


const path = require('path');



async function main() {
  creatDirectory()
 if (process.argv.length < 3){
    console.log("no website provided")
    process.exit(1)
  }

  const baseURL = process.argv[2]
  console.log("starting crawl")
  const pages = await crawlPage(baseURL, baseURL, {})

  printReport(pages)

}



main()