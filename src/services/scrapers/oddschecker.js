import puppeteer from 'puppeteer'
import { OddscheckerFootballUtils } from '../../utils/football/oddschecker.js'
import { CommonFootballUtils } from '../../utils/football/common.js'

const { urls, selectors, providers } = OddscheckerFootballUtils
const { odds_keys } = CommonFootballUtils

const getUrls = async (url) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(url)

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

const getGameData = async (browser, url) => {
    // const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(url, { waitUntil: 'networkidle2' })

	const teams = await page.$eval(selectors.outcomes, (outs) => {
		const rows = outs.innerText.split('\n')
		if (rows.length === 3) {
			return rows
		}
	})
    
    if (teams) {
        const odds = await page.evaluate(
            (teams, providers, odds_keys, selectors) => {
                const provider_odds = providers.map((provider) => {
                    return {
                        teams: {
                            team_1: teams[0].toLowerCase(),
                            team_2: teams[2].toLowerCase(),
                            provider,
                        },
                        odds: { provider },
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
        )
        page.close()
        return odds
    } else {
        page.close()
        return
    }
}

const getAllGames = async () => {
    const all_games = []
    const browser = await puppeteer.launch({ headless: false })
    const links = await getUrls(urls.football)
    console.log(links)
    // const games = await Promise.allSettled(pages.map((url) => getGameData(browser, url)))
    for (const link of links.slice(0, 10)) {
        const game_odds = await getGameData(browser, link)
        console.log(game_odds)
        all_games.push(game_odds)
    }
    browser.close()
    return all_games
}

console.log(await getAllGames())

export const OddscheckerScraper = {
    getUrls,
    getGameData
}
