import puppeteer from "puppeteer"
import { URL_SET, SELECTORS } from "../../utils/william_hill.js"
import { ODDS_KEYS } from "../../utils/common.js"

export const getDayData = async (url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const day_odds = await page.evaluate((SELECTORS, ODDS_KEYS) => {
        const odds = []
        const articles = document.querySelectorAll(SELECTORS.articles)

        articles.forEach((article) => {
            const game_title = article.querySelector(SELECTORS.game_title).innerText
            const [team_1, team_2] = game_title.split(' ₋ ')
            const game = {
                team_1: team_1.toLowerCase(),
                team_2: team_2.toLowerCase(),
                odds: {
                    william_hill: {}
                }
            }
            
            const oddsHTML = article.querySelectorAll(SELECTORS.odds)
            oddsHTML.forEach((odd, ind) =>{
                game.odds.william_hill[ODDS_KEYS[ind]] = parseFloat(odd.innerText)
            })
            odds.push(game)
        })
        return odds
    }, SELECTORS, ODDS_KEYS)
    browser.close()
    console.info(`Extracted william hill day data - ${day_odds.length} games`)
    return day_odds
}

export const getWeekData = async (url_set) => {
    const data = url_set.map((url) => getDayData(url))
    const nested_data = await Promise.all(data)
    return nested_data.flat()
}
