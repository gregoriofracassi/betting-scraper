import { CommonUtils } from './common.js'

const url = 'https://www.betclic.it/scommesse/calcio/serie-a_1_31_33'
const provider_name = 'Betclic'

const getWeekBtns = () => {
	return CommonUtils.weekdays_nums.map((num) => {
		return selectors.week_buttons(num)
	})
}

const selectors = {
	week_buttons: (week_day) => {
		return `#sidebar-sx > div.widget-filtro-side.bordato-widget.bordo-tondo.margine-giu > div.elementi-widget-fasce > div.filtro-settimana.maiuscolo.allinea-centro > a:nth-child(${week_day})`
	},
	articles: 'div.tabellaQuoteNew',
	line: 'p',
	data_index: {
		team_1: 2,
		team_2: 4,
		one: 7,
		x: 9,
		two: 11,
	},
	accept_cookies: '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
}

export const BetclicUtils = {
	url,
	provider_name,
	selectors,
	week_btns: getWeekBtns()
}
