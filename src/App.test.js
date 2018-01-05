const puppeteer = require('puppeteer')

const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 250,
    // executablePath: string (path to chrome or custom chromium)
    // timeout: number (default is 30 seconds, 0 means disable)
    // ignoreHTTPSErrors: bool (Whether to ignore HTTPS errors during navigation. Defaults to false.)
    devtools: true  // headless option will be set to false
  }
  return process.env.NODE_ENV === 'debug' ? debugging_mode : false;
};

test('First test', async () => {
  let browser = await puppeteer.launch(isDebugging())
  let page = await browser.newPage()

  page.emulate({
    viewport: {
      width: 500,
      height: 2400
      // isMobile: bool,
      // hasTouch: bool, 
      // isLandscape: bool
    },
     userAgent: ''
  }, 16000)

  // page.setUserAgent(userAgent)
  // page.setViewport(viewport)

   await page.goto('http://localhost:3000/')
   await page.waitForSelector('.App-title')

   const html = await page.$eval('.App-title', e => e.innerHTML)

   expect(html).toBe('Welcome to React')

   browser.close()

})


// Puppeteer requires at least Node v6.4.0, but the examples below use async/await which is only supported in Node v7.6.0 or greater

// The easiest way to get started with headless mode is to open the Chrome binary from the command line. If you've got Chrome 59+ installed, start Chrome with the --headless flag

// The --repl flag runs Headless in a mode where you can evaluate JS expressions in the browser, right from the command line:

