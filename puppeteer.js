const chrome = require('chrome-aws-lambda')

module.exports = async () => chrome.puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
})