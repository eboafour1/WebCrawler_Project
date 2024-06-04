const {normalizeURL, getURLsFromHTML} = require('./crawl.js')
const {test, expect} = require('@jest/globals')

test('normilizeURL stripe protocol', () => {
    const input = '' //https://facebook.com/path
    const actual = normalizeURL(input)
    const expected = '' //facebook.com/path
    expect(actual).toEqual(expected)
})

test('normilizeURL stripe trailing slash', () => {
    const input = 'https://facebook.com/path/'
    const actual = normalizeURL(input)
    const expected = 'facebook.com/path'
    expect(actual).toEqual(expected)
})

test('normilizeURL capitals', () => {
    const input = 'https://FACEBOOK.com/path'
    const actual = normalizeURL(input)
    const expected = 'facebook.com/path'
    expect(actual).toEqual(expected)
})

test('normilizeURL stripe http', () => {
    const input = 'http://facebook.com/path'
    const actual = normalizeURL(input)
    const expected = 'facebook.com/path'
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
           <a href="https://facebook.com/path/">facebook.com home
           </a>
        </body>
    </html>  
   ` 
    const inputBaseURL = "https://facebook.com/path/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://facebook.com/path/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
    const inputHTMLBody = `
    <html>
        <body>
           <a href="https://facebook.com/path1/">facebook.com Path1
           </a>
           <a href="https://facebook.com/path2/">facebook.com Path2
           </a>
        </body>
    </html>  
   ` 
    const inputBaseURL = "https://facebook.com"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://facebook.com/path1/, https://facebook.com/path2/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
           <a href="/path/">facebook.com home
           </a>
        </body>
    </html>  
   ` 
    const inputBaseURL = "https://facebook.com"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://facebook.com/path/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML invalid', () => {
    const inputHTMLBody = `
    <html>
        <body>
           <a href="invalid">Invalid URL
           </a>
        </body>
    </html>  
   ` 
    const inputBaseURL = "https://facebook.com"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})


