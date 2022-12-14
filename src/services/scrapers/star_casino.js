import puppeteer from 'puppeteer'
import { StarCasinoFootballUtils } from '../../utils/football/star_casino.js'
import { CommonFootballUtils } from '../../utils/football/common.js'

const URL = 'https://www.starcasino.it/scommesse/calcio/premier-league-181170'

const getPageData = async (url) => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url, { waitUntil: 'networkidle2' })
	await page.waitForSelector(StarCasinoFootballUtils.selectors.items)
	
	const page_odds = await page.evaluate(
		(selectors, odds_keys) => {
			const items_text = []
			const container = document.querySelector(selectors.items)
			// items.forEach((item) => {
			// 	const item_text = item.innerText
			// 	items_text.push(item_text)
			// })
			// return items_text.length
			return container.innerHTML
		},
		StarCasinoFootballUtils.selectors,
		CommonFootballUtils.odds_keys
	)

	// const day_odds = await page.evaluate(
	// 	(selectors, odds_keys) => {
	// 		const odds = []
	// 		const articles = document.querySelectorAll(selectors.articles)

	// 		articles.forEach((article) => {
	// 			const game_title = article.querySelector(selectors.game_title).innerText
	// 			const [team_1, team_2] = game_title.split(' ₋ ')
	// 			const game = {
	// 				teams: {
	// 					team_1: team_1.toLowerCase(),
	// 					team_2: team_2.toLowerCase(),
	// 				},
	// 				odds: {},
	// 			}

	// 			const oddsHTML = article.querySelectorAll(selectors.odds)
	// 			oddsHTML.forEach((odd, ind) => {
	// 				game.odds[odds_keys[ind]] = parseFloat(odd.innerText)
	// 			})
	// 			odds.push(game)
	// 		})
	// 		return odds
	// 	},
	// 	WilliamHillFootballUtils.selectors,
	// 	CommonFootballUtils.odds_keys
	// )
	browser.close()
	// console.info(`Extracted william hill day data - ${day_odds.length} games`)
	return page_odds
}

console.log(await getPageData(URL))

export const WilliamHillScraper = {
	getPageData
}
