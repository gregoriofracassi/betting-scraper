const odds_keys = ['one', 'x', 'two']

const odds_grouped = [
	['one', 'x', 'two'],
	['goal', 'no_goal'],
	['under_1dot5', 'over_1dot5'],
	['under_2dot5', 'over_2dot5'],
	['one_x', 'x_two', 'one_two'],
]

export const CommonFootballUtils = {
	odds_keys,
    odds_grouped,
	odds_extended: odds_grouped.flat()

}
