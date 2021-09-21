export default function determineStandings(rosters) {
	const parsedRosters = rosters.map((roster) => {
		const touchdowns = roster.players.reduce(
			(acc, cur) => cur.stats.TD + acc,
			0
		);
		const casualties = roster.players.reduce(
			(acc, cur) => cur.stats.CAS + acc,
			0
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
