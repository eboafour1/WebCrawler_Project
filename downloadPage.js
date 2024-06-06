async function downloadPage(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let html = '';
        res.on('data', (chunk) => {
          html += chunk;
        });
        res.on('end', () => {
          const $ = cheerio.load(html);
          const pageTitle = $('title').text();
  
          // save the HTML file
          const filePath = `${destinationFolder}/${pageTitle}.html`;
          fs.writeFileSync(filePath, html);
  
          // add the file to the zip stream
          zip.entry(filePath, html);
  
          resolve();
        });
      }).on('error', (err) => {
        console.error(err);
        reject(err);
      });
    });
  }

  module.exports = { 
    downloadPage 

}