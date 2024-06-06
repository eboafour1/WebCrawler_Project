const { JSDOM } = require('jsdom');
// const JSZip = require('jszip');
const fetch = require('node-fetch');
const JSZip = require('jszip')
const cheerio = require('cheerio')
const {writeToDirectory} = require('./destinationFolder');
const  axios  = require('axios');
// const {downloadPage} = require('./downloadPage')

const downloadPage=async (url)=>{
    try {
        const {data} = await axios.get(url)
        return data
    } catch (error) {
        return null
    }

}

async function crawlPage(baseURL, currentURL, pages, zip){

    const baseURLObj = new URL(baseURL)
    console.log({baseURLObj})
    const currentURLObj = new URL(currentURL)

    if (baseURLObj.hostname !== currentURLObj.hostname){
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)

    if (pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1;

    console.log('actively crawling: ${currentURL}')


    try{
        const resp = await fetch(currentURL)
        console.log({resp})
        if (resp.status >= 400 ){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }
        if (resp.status >= 500 ){
            console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes ("text/html")){
            console.log(`non html response, content type: ${contentType} on page: ${currentURL}`)
            return pages
        }

        const htmlBody = await resp.text();
        // console.log({htmlBody})
        // if (zip){
        //     zip.file(
        //         `${normalizedCurrentURL.replace('/', '_')}.html`, htmlBody
        //     );
        // }

       const nextURLs = await getURLsFromHTML(htmlBody, baseURL)
        //  getURLsFromHTML(htmlBody, baseURL)
        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages)
        }

    }catch (err){
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }

    return pages

    
}

async function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')

    for (const linkElement of linkElements){
        const nextURL = linkElement.href;
    //    console.log({nextURL})
        
            try {
                const downloadedPage = await downloadPage(nextURL)
                console.log({downloadedPage})
                const urlObj = new URL (nextURL, baseURL);
                // console.log({urlObj})
                if(urlObj){
                    urlObj.href.substring(0, urlObj.href.length - 1)
                    const fileName =  urlObj.href.substring(0, urlObj.href.length - 1) + '.html'
                //    console.log({fileName})
                writeToDirectory(downloadedPage,fileName)
                    // console.log({urlObj})
                    // urls.push(urlObj.href);
                
           
                urls.push(nextURL);
                }



            } catch (err){
                console.log(`error with relative url: ${nextURL}, ${err.message}`);
            }
            

        } 
        // console.log({urls})
          return urls;
       
}       
            
           

function normalizeURL(urlString){
    return urlString
}





  module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
} 