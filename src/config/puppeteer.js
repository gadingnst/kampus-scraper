const chrome = require('chrome-aws-lambda')

module.exports = () => chrome.executablePath
    .then(executablePath => chrome.puppeteer.launch({
        executablePath,
        args: chrome.args,
        headless: !process.env.NODE_ENV,
        ignoreHTTPSErrors: true
    }))
