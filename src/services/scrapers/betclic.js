import puppeteer from "puppeteer"
import { URL, getSelectors, getWeekBtns } from "../../utils/betclic.js"
import { clickElement } from "../../utils/navigation.js"

const SELECTORS = getSelectors()
const WEEK_BTNS = getWeekBtns()

const getDayData = async (url, week_day) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
        height: 20000,
        width: 1500
    });
    await page.goto(url, {waitUntil: 'networkidle2'})
    await clickElement(page, SELECTORS.accept_cookies)
    await clickElement(page, week_day)
    
    await new Promise(r => setTimeout(r, 5000))
    await page.screenshot({path: 'img.png'}) // find better solution
    
    const day_odds = await page.evaluate((SELECTORS) => {
        const odds = []
        const articles = document.querySelectorAll(SELECTORS.articles)
        articles.forEach((article, ind) => {
            const teams_HTML = article.querySelectorAll(SELECTORS.line)
            const teams_p = Array.from(teams_HTML).map((team) => team.innerText)

            const game = {
                team_1: teams_p[SELECTORS.data_index.team_1].toLowerCase(),
                team_2: teams_p[SELECTORS.data_index.team_2].toLowerCase(),
                odds: {
                    one: parseFloat(teams_p[SELECTORS.data_index.one]),
                    x: parseFloat(teams_p[SELECTORS.data_index.x]),
                    two: parseFloat(teams_p[SELECTORS.data_index.two]),
                }
            }
            odds.push(game)
        })
        return odds
    }, SELECTORS)
    browser.close()
    return day_odds
}

const data = WEEK_BTNS.map((btn) => getDayData(URL, btn))
const FootballData = await Promise.all(data)

console.log(FootballData.flat())