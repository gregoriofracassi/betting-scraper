import { getCurrentWeekdays } from "./common.js"

const URL = (weekDay) => `https://sports.williamhill.it/betting/it-it/calcio/matches/competition/${weekDay}/esito-finale-1x2`

export const getUrlSet = () => {
    return getCurrentWeekdays().map((day) => URL(day))
}

export const getSelectors = () => {
    return {
        articles: 'article.sp-o-market',
        game_title: 'div.sp-o-market__title a span',
        odds: 'section button span'
    }
}