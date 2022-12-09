import { getCurrentWeekdays } from './common.js'

const URL = (weekDay) => `https://sports.williamhill.it/betting/it-it/calcio/matches/competition/${weekDay}/esito-finale-1x2`
export const PROVIDER_NAME_WILLIAM_HILL = 'William Hill'

const getUrlSet = () => {
	return getCurrentWeekdays().map((day) => URL(day))
}

export const SELECTORS = {
	articles: 'article.sp-o-market',
	game_title: 'div.sp-o-market__title a span',
	odds: 'section button span',
}

export const URL_SET = getUrlSet()
