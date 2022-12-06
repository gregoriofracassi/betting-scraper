import { getDay } from "date-fns"

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export const ODDS_KEYS = ['one', 'x', 'two']

export const getCurrentWeekdays = () => {
    return WEEKDAYS.map((day) => day === WEEKDAYS[getDay(new Date())] ? 'today' : day)
}

