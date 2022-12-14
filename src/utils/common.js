import { getDay } from "date-fns"

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const weekdays_nums = [1, 2, 3, 4, 5, 6, 7]

const getCurrentWeekdays = () => {
    return weekdays.map((day) => day === weekdays[getDay(new Date())] ? 'today' : day)
}

const provider_names = [
    {
        key: 'betclic',
        label: 'Betclic'
    },
    {
        key: 'williamhill',
        label: 'William Hill'
    },
    {
        key: 'starcasino',
        label: 'Star Casino'
    },
]

export const CommonUtils = {
    weekdays_nums,
    provider_names,
    getCurrentWeekdays
}
