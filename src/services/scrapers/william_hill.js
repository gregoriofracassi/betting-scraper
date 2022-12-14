import puppeteer from 'puppeteer'
import { WilliamHillFootballUtils } from '../../utils/football/william_hill.js'
import { CommonFootballUtils } from '../../utils/football/common.js'

const getDayData = async (url) => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url)

	const day_odds = await page.evaluate(
		(selectors, odds_keys) => {
			const odds = []
			const articles = document.querySelectorAll(selectors.articles)

			articles.forEach((article) => {
				const game_title = article.querySelector(selectors.game_title).innerText
				const [team_1, team_2] = game_title.split(' ₋ ')
				const game = {
					teams: {
						team_1: team_1.toLowerCase(),
						team_2: team_2.toLowerCase(),
					},
					odds: {},
				}

				const oddsHTML = article.querySelectorAll(selectors.odds)
				oddsHTML.forEach((odd, ind) => {
					game.odds[odds_keys[ind]] = parseFloat(odd.innerText)
				})
				odds.push(game)
			})
			return odds
		},
		WilliamHillFootballUtils.selectors,
		CommonFootballUtils.odds_keys
	)
	browser.close()
	console.info(`Extracted william hill day data - ${day_odds.length} games`)
	return day_odds
}

export const WilliamHillScraper = {
	getDayData
}
