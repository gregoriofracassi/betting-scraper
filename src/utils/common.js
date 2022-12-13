import { getDay } from "date-fns"

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const weekdays_nums = [1, 2, 3, 4, 5, 6, 7]

const odds_keys = ['one', 'x', 'two']

const getCurrentWeekdays = () => {
    return weekdays.map((day) => day === weekdays[getDay(new Date())] ? 'today' : day)
}

export const CommonUtils = {
    weekdays_nums,
    odds_keys,
    getCurrentWeekdays
}
