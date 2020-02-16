const chrome = require('chrome-aws-lambda')

module.exports = () => chrome.executablePath
    .then(executablePath => chrome.puppeteer.launch({
        executablePath,
        args: chrome.args,
        // headless: true
        headless: chrome.headless
    }))
