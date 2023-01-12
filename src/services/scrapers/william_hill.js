import puppeteer from 'puppeteer'
import { WilliamHillFootballUtils } from '../../utils/football/william_hill.js'
import { CommonFootballUtils } from '../../utils/football/common.js'

const { selectors, url_odd_types } = WilliamHillFootballUtils
const { odds_grouped } = CommonFootballUtils

const launch = async (url) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.setViewport({
		height: 20000,
		width: 1500,
	})
	await page.goto(url, { waitUntil: 'networkidle2' })

	return { browser, page }
}

const getDayOdds = async (page, odds_keys) => {
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

const getDayData = async (url) => {
	let all_odds = []

	for (const [index, odds_types] of url_odd_types.entries()) {
		const new_url = url + odds_types
		const { browser, page } = await launch(new_url)
		const day_odds = await getDayOdds(page, odds_grouped[index])
		all_odds = day_odds.map((game) => {
			const matching_game = all_odds.find((prev_game) => prev_game.teams.team_1 === game.teams.team_1 && prev_game.teams.team_2 === game.teams.team_2)
			const odds_obj = matching_game ? { ...game.odds, ...matching_game.odds } : game.odds
			return {
				teams: game.teams,
				odds: odds_obj,
			}
		})
		browser.close()
	}
	return all_odds
}

export const WilliamHillScraper = {
	getDayData,
}
