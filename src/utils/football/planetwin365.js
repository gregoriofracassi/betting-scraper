const url = 'https://www.planetwin365.it/it/scommesse/palinsesto-sport'

const selectors = {
    football_table: '#S342_0',
    send_btn: 'a.btnSxGroups',
    checkbox: 'div.leagueItem span input',
    odds_div: 'div.divQt',
    game_row: 'tr.dgAItem',
    teams: 'td.nmInc',
    odds: 'table.dgQuote',
    stats: 'td.statsInc div',
    odd: 'tr.OddsQuotaItemStyle td',
    container: 'div.divMainEvents'
}

export const Planetwin365Utils = {
    selectors,
    url
}