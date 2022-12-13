import puppeteer from 'puppeteer'
import { BetclicUtils } from '../../utils/betclic.js'
import { NavigationUtils } from '../../utils/scrapers/navigation.js' 

const getDayData = async (url, week_btn) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.setViewport({
		height: 20000,
		width: 1500,
	})
	await page.goto(url, { waitUntil: 'networkidle2' })
	await NavigationUtils.clickElement(page, BetclicUtils.selectors.accept_cookies)
	await NavigationUtils.clickElement(page, week_btn)

	await new Promise((r) => setTimeout(r, 5000))
	await page.screenshot({ path: 'img.png' }) // find better solution

	const day_odds = await page.evaluate((selectors) => {
		const odds = []
		const articles = document.querySelectorAll(selectors.articles)
		articles.forEach((article) => {
			const teams_HTML = article.querySelectorAll(selectors.line)
			const teams_p = Array.from(teams_HTML).map((team) => team.innerText)

			const game = {
				teams: {
					team_1: teams_p[selectors.data_index.team_1].toLowerCase(),
					team_2: teams_p[selectors.data_index.team_2].toLowerCase(),
				},
				odds: {
					one: parseFloat(teams_p[selectors.data_index.one]),
					x: parseFloat(teams_p[selectors.data_index.x]),
					two: parseFloat(teams_p[selectors.data_index.two]),
				},
			}
			odds.push(game)
		})
		return odds
	}, BetclicUtils.selectors)
	browser.close()
	console.info(`Extracted betclic day data - ${day_odds.length} games`)
	return day_odds
}

export const BetclicScraper = {
	getDayData
}
