import puppeteer from 'puppeteer'
import { Planetwin365Utils } from '../../utils/football/planethill365.js'
import { CommonFootballUtils } from '../../utils/football/common.js'
import { CommonUtils } from '../../utils/common.js'

const URL = 'https://www.planetwin365.it/it/scommesse/palinsesto-sport'

const { selectors } = Planetwin365Utils
const { odds_keys } = CommonFootballUtils

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

const getData = async (url) => {
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

    for (const [ind, checkbox] of checkboxes_chunks[0].entries()) {
        if (ind <= 30) {
            await checkbox.click()
        }
    }
    await new Promise((r) => setTimeout(r, 5000))
    await submit.click()

    return checkboxes.length
}

console.log(await getData(URL))

export const Planetwin365 = {
	getData,
}
