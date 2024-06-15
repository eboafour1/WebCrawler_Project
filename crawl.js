const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');
const JSZip = require('jszip');
const cheerio = require('cheerio')
const {writeToDirectory} = require('./destinationFolder');
const  axios  = require('axios');

const downloadPage=async (url)=>{
    try {
        const {data} = await axios.get(url)
        return data
    } catch (error) {
        return null
    }

}

// Crawl a page and its links recursively
async function crawlPage(baseURL, currentURL, pages, zip) {
    const baseURLObj = new URL(baseURL);
    // console.log({ baseURLObj });
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);

    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`Actively crawling: ${currentURL}`);

    try {
        const resp = await fetch(currentURL);
        // console.log({ resp });
        if (resp.status >= 400) {
            console.log(`Error in fetch with status code: ${resp.status} on page: ${currentURL}`);
            return pages;
        }

        const contentType = resp.headers.get("content-type");
        if (!contentType.includes("text/html")) {
            console.log(`Non HTML response, content type: ${contentType} on page: ${currentURL}`);
            return pages;
        }

        const htmlBody = await resp.text();

        if (zip) {
            zip.file(
                `${normalizedCurrentURL.replace('/', '_')}.html`, htmlBody
            );
        }

        const nextURLs = await getURLsFromHTML(htmlBody, baseURL);
        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages, zip);
        }
    } catch (err) {
        console.log(`Error in fetch: ${err.message}, on page: ${currentURL}`);
    }

    return pages;
}

// Extract URLs from the HTML body
async function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        const nextURL = linkElement.href;

        try {
            const downloadedPage = await downloadPage(nextURL);
            const urlObj = new URL(nextURL, baseURL);

            if (urlObj && downloadedPage) {
                const fileName = urlObj.href.replace(/\/$/, '').replace(/[\/:]/g, '_') + '.html';
                writeToDirectory(downloadedPage, fileName);
                urls.push(nextURL);
            }
        } catch (err) {
            console.log(`Error with relative URL: ${nextURL}, ${err.message}`);
        }
    }

    return urls;
}      
            
           

function normalizeURL(urlString){
    if(!urlString.includes('https') || !urlString.includes('http') ){
        return `https://${urlString}`
    }
    return urlString
}





  module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
} 