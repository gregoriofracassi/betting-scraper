import puppeteer from "puppeteer"
import { getUrlSet, getSelectors } from "../../utils/william_hill.js"
import { ODDS_KEYS } from "../../utils/common.js"

const URL_SET = getUrlSet()
const SELECTORS = getSelectors()

const getDayData = async (url) => {
    const browser = await puppeteer.launch({headless: false})
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
                odds: {}
            }
            
            const oddsHTML = article.querySelectorAll(SELECTORS.odds)
            oddsHTML.forEach((odd, ind) =>{
                game.odds[ODDS_KEYS[ind]] = parseFloat(odd.innerText)
            })
            odds.push(game)
        })
        return odds
    }, SELECTORS, ODDS_KEYS)
    browser.close()
    return day_odds
}

const data = URL_SET.map((url) => getDayData(url))
const FootballData = await Promise.all(data)

console.log(FootballData.flat())