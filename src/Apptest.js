const puppeteer = require('puppeteer')
const faker = require('faker')
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']

const user = {
  email: faker.internet.email(),
  password: 'test',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName()
}

const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 25,
    devtools: true  
  }
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {}
}

let browser
let page
let logs = []
let errors = []
beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging())
  page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url.includes('swapi')) {
      interceptedRequest.abort()
    } else {
      interceptedRequest.continue()
    }
  })
  page.on('console', c => {
    console.log(c.text)
    logs.push(c.text)
  })
  page.on('pageerror', e => errors.push(e.text))
  await page.goto('http://localhost:3000/')
  await page.emulate(iPhone)
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
    if (listItems.length !== 4)
      await page.pdf({path: 'screenshot.png'})
    expect(listItems.length).toBe(4)
  })
  describe('login form', () => {
    test('fills out form and submits', async () => {

      await page.setCookie({ name: 'JWT', value: 'kdkdkddf' })

      const firstNameEl = await page.$('[data-testid="firstName"]')
      const lastNameEl = await page.$('[data-testid="lastName"]')
      const emaildEl = await page.$('[data-testid="email"]')
      const passwordEl = await page.$('[data-testid="password"]')
      const submitEl = await page.$('[data-testid="submit"]')

      await firstNameEl.tap()    
      await page.type('[data-testid="firstName"]', user.firstName)

      await lastNameEl.tap()        
      await page.type('[data-testid="lastName"]', user.lastName)

      await emaildEl.tap()            
      await page.type('[data-testid="email"]', user.email)

      await passwordEl.tap()
      await page.type('[data-testid="password"]', user.password)

      await submitEl.tap()    

      await page.waitForSelector('[data-testid="success"]')
    }, 16000)
    test('sets firstName cookie', async () => {
      const cookies = await page.cookies()
      const firstNameCookie = cookies.find(c => c.name === 'firstName' && c.value === user.firstName)

      expect(firstNameCookie).not.toBeUndefined()
    })
  })
  test.skip('does not have console logs', () => {
    const newLogs = logs.filter( s => s !== '%cDownload the React DevTools for a better development experience: https://fb.me/react-devtools font-weight:bold')

    expect(newLogs.length).toBe(0)
  })
  test.skip('does not have exceptions', () => {
    expect(errors.length).toBe(0)
  })
  test('fails to fetch starWars endpoint', async () => {
    const h3 = await page.$eval('[data-testid="starWars"]', e => e.innerHTML)
    expect(h3).toBe('Something went wrong')
  })
})

afterAll(() => {
  if (isDebugging()) {
    browser.close()
  }
})