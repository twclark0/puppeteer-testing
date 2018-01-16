const puppeteer = require('puppeteer')
const faker = require('faker')
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const user = {
  email: faker.internet.email(),
  password: 'test',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName()
}

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
    const html = await page.$eval('[data-testid="h1"]', e => e.innerHTML)

    expect(html).toBe('Welcome to React')

  }, 16000)

  test('nav loads correctly', async () => {
    const navbar = await page.$eval('[data-testid="navbar"]', el => el ? true : false)
    const listItems = await page.$$('[data-testid="navBarLi"]')

    expect(navbar).toBe(true)
    expect(listItems.length).toBe(4)
  })

  test('login form works correctly', async () => {
    const page2 = await browser.newPage()
    await page2.emulate(iPhone)
    await page2.goto('http://localhost:3000/')

    const firstNameEl = await page2.$('[data-testid="firstName"]')
    const lastNameEl = await page2.$('[data-testid="lastName"]')
    const emaildEl = await page2.$('[data-testid="email"]')
    const passwordEl = await page2.$('[data-testid="password"]')
    const submitEl = await page2.$('[data-testid="submit"]')

    await firstNameEl.tap()    
    await page2.type('[data-testid="firstName"]', user.firstName)

    await lastNameEl.tap()        
    await page2.type('[data-testid="lastName"]', user.lastName)

    await emaildEl.tap()            
    await page2.type('[data-testid="email"]', user.email)

    await passwordEl.tap()
    await page2.type('[data-testid="password"]', user.password)

    await submitEl.tap()    

    await page2.waitForSelector('[data-testid="success"]')
  }, 16000)
})

afterAll(() => {
  if (isDebugging()) {
    browser.close()
  }
})