import { WEEKDAYS_NUMS } from "./common.js"

export const URL = 'https://www.betclic.it/scommesse/calcio/serie-a_1_31_33'

const getWeekBtns = () => {
    return WEEKDAYS_NUMS.map((num) => {
        return SELECTORS.week_buttons(num)
    })
}

export const SELECTORS = {
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

export const WEEK_BTNS = getWeekBtns()