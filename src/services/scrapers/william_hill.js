import puppeteer from 'puppeteer'
import { WilliamHillFootballUtils } from '../../utils/football/william_hill.js'
import { CommonFootballUtils } from '../../utils/football/common.js'

const { selectors, drpdwn_indexes } = WilliamHillFootballUtils
const { odds_keys } = CommonFootballUtils

const launch = async (url) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(url)

	return { browser, page }
}

const getDayOdds = async (page) => {
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
		selectors,
		odds_keys
	)
	console.info(`Extracted william hill day data - ${day_odds.length} games`)
	return day_odds
}

const clickDropDown = async (page, index) => {
	const dropdown = await page.$(selectors.dropdown)
	await dropdown.click()
	const rows = await page.$$(selectors.drp_down_tr)
	await rows[index].click({ waitUntil: 'domcontentloaded' })
}

const getDayData = async (url) => {
	const { browser, page } = await launch(url)

	await clickDropDown(page, 7)

	await new Promise((r) => setTimeout(r, 10000))

	const day_odds = await getDayOdds(page)

	browser.close()
	return day_odds
}

export const WilliamHillScraper = {
	getDayData,
}

// 1457