const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')

async function main() {
 if (process.argv.length < 3){
    console.log("no website provided")
    process.exit(1)
  }

  console.log("starting crawl")
  const pages = await crawlPage(baseURL, baseURL, {})

  printReport(pages)

}

main()