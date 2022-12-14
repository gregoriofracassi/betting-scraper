import { CommonUtils } from '../common.js'

const url = (weekDay) => `https://sports.williamhill.it/betting/it-it/calcio/matches/competition/${weekDay}/esito-finale-1x2`

const getUrlSet = () => {
	return CommonUtils.getCurrentWeekdays().map((day) => url(day))
}

const selectors = {
	articles: 'article.sp-o-market',
	game_title: 'div.sp-o-market__title a span',
	odds: 'section button span',
}

export const WilliamHillFootballUtils = {
	url_set: getUrlSet(),
	selectors
}
