const puppeteer = require('puppeteer')

const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 50,
    devtools: true  
  }
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
}

let browser
let page

beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging())
  page = await browser.newPage()
  await page.goto('http://localhost:3000/')
  page.setViewport({ width: 500, height: 2400 })
})

describe('on page load ', () => {
  test('h1 loads correctly', async () => {

    const html = await page.$eval('.App-title', e => e.innerHTML)

    expect(html).toBe('Welcome to React')

  })

  test('nav loads correctly', async () => {

    const navbar = await page.$eval('.navbar', el => el ? true : false)
    const listItems = await page.$$('.nav-li')

    expect(navbar).toBe(true)
    expect(listItems.length).toBe(4)
  })

  test('images src loads correctly', async () => {

    const logo = await page.$eval('.App-logo', el => el.src)

    expect(logo).toBe('http://localhost:3000/static/media/logo.5d5d9eef.svg')

  })
})

afterAll(() => {
  if (isDebugging()) {
    browser.close()
  }
})
