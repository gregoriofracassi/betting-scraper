import { CommonUtils } from './common.js'

const url = (weekDay) => `https://sports.williamhill.it/betting/it-it/calcio/matches/competition/${weekDay}/esito-finale-1x2`
const provider_name = 'William Hill'

const getUrlSet = () => {
	return CommonUtils.getCurrentWeekdays().map((day) => url(day))
}

const selectors = {
	articles: 'article.sp-o-market',
	game_title: 'div.sp-o-market__title a span',
	odds: 'section button span',
}

export const WilliamHillUtils = {
	provider_name,
	url_set: getUrlSet(),
	selectors
}
