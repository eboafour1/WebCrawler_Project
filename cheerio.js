// find all links on the current page
const $ = cheerio.load(fs.readFileSync(`${destinationFolder}/${currentPageUrl.split('/').pop()}.html`, 'utf8'));
$('a').each((index, element) => {
  const href = $(element).attr('href');
  if (href && href.startsWith('/')) {
    const nextPageUrl = `${url}${href}`;
    if (!queue.includes(nextPageUrl)) {
      queue.push(nextPageUrl);
    }
  }
});