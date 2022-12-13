import GameModel from "../../_models/game/index.js"

const determineGames = (week_games, saved_games) => {
	const add_games = []
	const update_games =[]
	week_games.forEach((scraped_game) => {
		const same_game = saved_games.find((saved_game) => {
			return (
				saved_game.teams.find((teams) => {
					return (
						scraped_game.teams.team_1.slice(0,3) === teams.team_1.slice(0,3) &&
						scraped_game.teams.team_2.slice(0,3) === teams.team_2.slice(0,3)
					)
				})
			)
		})
		if (same_game) {
			same_game.teams = scraped_game.teams
			same_game.odds = scraped_game.odds
			update_games.push(same_game)
		} else {
			add_games.push(scraped_game)
		}
	})
	return [add_games, update_games]
}

const addTeamsandOdds = async (games_to_update) => {
	const updated_games = []
	for (const game of games_to_update) {
		const updated = await GameModel.findByIdAndUpdate(
			game._id,
			{
				$push: { teams: game.teams, odds: game.odds },
			},
			{
				runValidators: true,
				new: true,
			}
		)
		updated_games.push(updated)
	}
	console.info(`${updated_games.length} games updated in db`)
}

export const ProviderService = {
	determineGames,
	addTeamsandOdds
}