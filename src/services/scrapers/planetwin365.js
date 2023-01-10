import puppeteer from 'puppeteer'
import { Planetwin365Utils } from '../../utils/football/planetwin365.js'
import { CommonFootballUtils } from '../../utils/football/common.js'

const { url, selectors } = Planetwin365Utils
const { odds_extended } = CommonFootballUtils

const sliceCheckboxes = (checkboxes, value) => {
	const result = []
	const sub_arr_num = Math.floor(checkboxes.length / value)
	for (let i = 0; i < sub_arr_num; i++) {
		const sub_result = checkboxes.splice(0, value)
		result.push(sub_result)
	}
	result.push(checkboxes)
	return result
}

const getHandles = async (page) => {
	const football_table = await page.$(selectors.football_table)
	const submit = await football_table.$(selectors.send_btn)
	const checkboxes = await football_table.$$(selectors.checkbox)

	return { submit, checkboxes }
}

const getPageData = async (page) => {
	const odds = page.evaluate(
		async (selectors, odds_extended) => {
			const odds = []
			const odds_divs = document.querySelectorAll(selectors.odds_div)
			odds_divs.forEach((div) => {
				const rows = div.querySelectorAll(selectors.game_row)
				rows.forEach((row) => {
					if (row.querySelector(selectors.stats)) {
						const teams = row.querySelector(selectors.teams).innerText.toLowerCase()
						const [team_1, team_2] = teams.split(' - ')
						const odds_obj = {}
						const odds_line = row.querySelectorAll(selectors.odd)
						odds_extended.forEach((odd, ind) => {
							const num = odds_line[ind].innerText.replace(',', '.')
							odds_obj[odd] = parseFloat(num)
						})
						odds.push({
							teams: {
								team_1,
								team_2,
							},
							odds: odds_obj,
						})
					}
				})
			})
			return odds
		},
		selectors,
		odds_extended
	)
	return odds
}

const getData = async (url) => {
	const all_odds = []

	const launch = async () => {
		const browser = await puppeteer.launch({ headless: false })
		const page = await browser.newPage()
		await page.setViewport({
			height: 20000,
			width: 1500,
		})
		await page.goto(url, { waitUntil: 'networkidle2' })
		return { browser, page }
	}

	const { browser, page } = await launch()
	let { submit, checkboxes } = await getHandles(page)
	let checkboxes_chunks = sliceCheckboxes(checkboxes, 30)

	for (const [ind, chunk] of checkboxes_chunks.entries()) {
		if (ind === 0) {
			for (const checkbox of chunk) {
				await checkbox.click()
			}
			await submit.click()
			await new Promise((r) => setTimeout(r, 5000))
			const odds = await getPageData(page)
			all_odds.push(...Array.from(odds))
			browser.close()
		} else {
			const { browser, page } = await launch()
			const handles = await getHandles(page)
			submit = handles.submit
			checkboxes = handles.checkboxes
			checkboxes_chunks = sliceCheckboxes(checkboxes, 30)
			for (const checkbox of checkboxes_chunks[ind]) {
				await checkbox.click()
			}
			await submit.click()
			await new Promise((r) => setTimeout(r, 5000))
			const odds = await getPageData(page)
			all_odds.push(...Array.from(odds))
			browser.close()
		}
	}
	return all_odds
}

console.log(await getData(url))

export const Planetwin365 = {
	getData,
}
