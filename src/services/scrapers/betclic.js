import puppeteer from "puppeteer"
import { URL, getSelectors } from "../../utils/betclic.js"
import { ODDS_KEYS } from "../../utils/common.js"
import { scrollPageToBottom } from "puppeteer-autoscroll-down"

const SELECTORS = getSelectors()

const getFootballData = async (url) => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--start-maximized"] })
    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle2'})
    const accept_cookies = await page.waitForSelector('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')
    if (accept_cookies) {
        accept_cookies.click()
    }
    const mart = await page.waitForSelector(SELECTORS.week_buttons.ma)
    if (mart) {
        mart.click()
    }

    await new Promise(r => setTimeout(r, 3000))
    
    const day_odds = await page.evaluate((SELECTORS) => {
        const odds = []
        const articles = document.querySelectorAll(SELECTORS.articles)
        articles.forEach((article, ind) => {
            const game = {}
            game[ind] = article.innerText
            // const teamsHTML = article.querySelectorAll(SELECTORS.teams)
            odds.push(game)

    //         const [team_1, team_2] = game_title.split(' ₋ ')
    //         const game = {
    //             team_1: team_1.toLowerCase(),
    //             team_2: team_2.toLowerCase(),
    //             odds: {}
    //         }
            
    //         const oddsHTML = article.querySelectorAll('section button span')
    //         oddsHTML.forEach((odd, ind) =>{
    //             game.odds[odds_keys[ind]] = parseFloat(odd.innerText)
    //         })
    //         today_odds.push(game)
        })
        return odds
    }, SELECTORS)
    browser.close()
    return day_odds
}

const FootballData = await getFootballData(URL)

// const data = URL_SET.map((url) => getFootballData(url))
// const FootballData = await Promise.all(data)

console.log(FootballData)