import LOCAL from './local';

export default function determineStandings(rosters) {
	const deadPlayers = LOCAL.read('deadPlayers');

	const parsedRosters = rosters.map((roster) => {
		const deadPlayerTDs =
			Array.isArray(deadPlayers) && deadPlayers.length
				? deadPlayers
						.filter((player) => player.rosterId === roster.id)
						.reduce((acc, cur) => cur.stats.TD + acc, 0)
				: 0;
		const deadPlayerCAS =
			Array.isArray(deadPlayers) && deadPlayers.length
				? deadPlayers
						.filter((player) => player.rosterId === roster.id)
						.reduce((acc, cur) => cur.stats.CAS + acc, 0)
				: 0;
		const touchdowns = roster.players.reduce(
			(acc, cur) => cur.stats.TD + acc,
			deadPlayerTDs
		);
		const casualties = roster.players.reduce(
			(acc, cur) => cur.stats.CAS + acc,
			deadPlayerCAS
		);
		return { ...roster, touchdowns, casualties };
	});

	return parsedRosters.sort((a, b) => {
		// Compare league points
		if (a.leaguePoints < b.leaguePoints) return 1;
		if (a.leaguePoints > b.leaguePoints) return -1;

		// Compare TDs as 1st tie-breaker
		if (a.touchdowns < b.touchdowns) return 1;
		if (a.touchdowns > b.touchdowns) return -1;

		// Compare CAS as 2nd tie-breaker
		if (a.casualties < b.casualties) return 1;
		if (a.casualties > b.casualties) return -1;

		return 0;
	});
}
