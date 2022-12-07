import puppeteer from "puppeteer"
import { SELECTORS, WEEK_BTNS } from "../../utils/betclic.js"
import { clickElement } from "../../utils/navigation.js"

export const getBetclicData = async (url, week_btn) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
        height: 20000,
        width: 1500
    });
    await page.goto(url, {waitUntil: 'networkidle2'})
    await clickElement(page, SELECTORS.accept_cookies)
    await clickElement(page, week_btn)
    
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
                    betclic: {
                        one: parseFloat(teams_p[SELECTORS.data_index.one]),
                        x: parseFloat(teams_p[SELECTORS.data_index.x]),
                        two: parseFloat(teams_p[SELECTORS.data_index.two]),
                    }
                }
            }
            odds.push(game)
        })
        return odds
    }, SELECTORS)
    browser.close()
    console.info(`Extracted betclic day data - ${day_odds.length} games`)
    return day_odds
}