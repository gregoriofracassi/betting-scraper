import { getDay } from "date-fns"

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const WEEKDAYS_NUMS = [1, 2, 3, 4, 5, 6, 7]

export const ODDS_KEYS = ['one', 'x', 'two']

export const getCurrentWeekdays = () => {
    return WEEKDAYS.map((day) => day === WEEKDAYS[getDay(new Date())] ? 'today' : day)
}
