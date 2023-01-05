import puppeteer from 'puppeteer'
import { OddscheckerlFootballUtils } from '../../utils/football/oddschecker.js'
import { CommonFootballUtils } from '../../utils/football/common.js'
import { CommonUtils } from '../../utils/common.js'

const { urls, selectors, providers } = OddscheckerlFootballUtils
const { odds_keys } = CommonFootballUtils

const getUrls = async (url) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(url, { waitUntil: 'networkidle2' })
	await page.keyboard.press('Escape')

	const frames = page.frames()
	const links = await frames[0].$$eval('a', async (as) => {
		const urls = []
		as.forEach((a) => {
			if (a.innerText.includes('\n')) {
				urls.push(a.getAttribute('href'))
			}
		})
		return urls
	})
	browser.close()
	return links.filter((link) => link.startsWith(urls.check))
}

const getGameData = async (url, date) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(url, { waitUntil: 'networkidle2' })
	await page.keyboard.press('Escape')

	const teams = await page.$eval(selectors.outcomes, (outs) => {
		const rows = outs.innerText.split('\n')
		if (rows.length === 3) {
			return rows
		} else {
			throw new Error('Number of elements in teams table is not 3')
		}
	})
    
    const odds = await page.evaluate(
        (teams, providers, odds_keys, selectors, date) => {
            const provider_odds = providers.map((provider) => {
                return {
                    teams: {
                        team_1: teams[0].toLowerCase(),
                        team_2: teams[2].toLowerCase(),
                        provider,
                    },
                    odds: { provider },
                    date,
                }
            })
            const rows = document.querySelectorAll(selectors.row)
            for (const [index, row] of Array.from(rows).entries()) {
                const buttons = row.querySelectorAll(selectors.button)
                if (buttons.length === 12) {
                    buttons.forEach((btn, ind) => {
                        const provider_game = provider_odds.find((game) => game.teams.provider === providers[ind])
                        provider_game.odds[odds_keys[index]] = parseFloat(btn.innerText)
                    })
                } else {
                    throw new Error(`Odds in this row are not 12`)
                }
            }
            return provider_odds
        },
        teams,
        providers,
        odds_keys,
        selectors,
        date
    )
	
	return odds
}

console.log(await getGameData('https://www.oddschecker.com/it/calcio/italia/serie-a/fiorentina-sassuolo', 'cazzo'))

export const OddscheckerScraper = {}
