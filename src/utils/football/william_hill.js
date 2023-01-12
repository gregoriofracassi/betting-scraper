import { CommonUtils } from '../common.js'

const url = (weekDay) => `https://sports.williamhill.it/betting/it-it/calcio/matches/competition/${weekDay}/`
const url_odd_types = [
	'esito-finale-1x2',
	'segneranno-entrambe-le-squadre',
	'overunder-15-goal',
	'overunder-25-goal',
	'doppia-chance'
]

const drpdwn_indexes = [1, 2, 4, 5, 7]

const getUrlSet = () => {
	return CommonUtils.getCurrentWeekdays().map((day) => url(day))
}

const selectors = {
	articles: 'article.sp-o-market',
	game_title: 'div.sp-o-market__title a span',
	odds: 'section button span',
	dropdown: 'table.css-qede7f',
	drp_down_tr: 'tr.css-156ogkc'
}

export const WilliamHillFootballUtils = {
	url_set: getUrlSet(),
	selectors,
	drpdwn_indexes,
	url_odd_types
}
