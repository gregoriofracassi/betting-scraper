import puppeteer from 'puppeteer'
import { Planetwin365Utils } from '../../utils/football/planetwin365.js'
import { CommonFootballUtils } from '../../utils/football/common.js'
import { CommonUtils } from '../../utils/common.js'

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

const goToOddsPage = async (url) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.setViewport({
		height: 20000,
		width: 1500,
	})
	await page.goto(url, { waitUntil: 'networkidle2' })
	const football_table = await page.$(selectors.football_table)
	const submit = await football_table.$(selectors.send_btn)
	const checkboxes = await football_table.$$(selectors.checkbox)

	const checkboxes_chunks = sliceCheckboxes(checkboxes, 30)
	for (const checkbox of checkboxes_chunks[0]) {
		await checkbox.click()
	}
	await submit.click()
	await new Promise((r) => setTimeout(r, 5000))
	// await getData(page)

	const odds = page.evaluate(async (selectors, odds_extended) => {
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
							team_2
						},
						odds: odds_obj
					})
                }
            })
        })
        return odds
        // return games_rows.map((row) => row.innerText)
	}, selectors, odds_extended)

	return odds
}

const getData = async (page) => {
	const odds = page.$$eval(selectors.game_row, async (rows) => {
		return rows.map((row) => row.innerText)
	})
}

console.log(await goToOddsPage(url))

export const Planetwin365 = {
	goToOddsPage,
}
