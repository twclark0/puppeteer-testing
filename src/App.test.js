const puppeteer = require('puppeteer')

const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 250,
    devtools: true  
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
    },
     userAgent: ''
  })

   await page.goto('http://localhost:3000/')
   await page.waitForSelector('.App-title')

   const html = await page.$eval('.App-title', e => e.innerHTML)

   expect(html).toBe('Welcome to React')

   browser.close()

}, 16000)