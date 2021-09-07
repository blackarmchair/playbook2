import React from 'react';
import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useRosterDispatch, getRosters } from '../../contexts/roster';
import PlayerDetail from '../../components/PlayerDetail';

const PlayerDetailPage = () => {
	const router = useRouter();
	const playerId = router.query.player;
	const dispatch = useRosterDispatch();

	const [loading, setLoading] = React.useState(true);
	const [player, setPlayer] = React.useState({});
	React.useEffect(() => {
		getRosters().then((rosters) => {
			const players = [];
			rosters.forEach((r) => {
				r.players.forEach((p) => {
					players.push(p);
				});
			});
			setPlayer(players.find((p) => p.uuid === playerId));
			setLoading(false);
		});
	}, [dispatch, router, playerId]);

	return (
		<>
			<Head>
				<title>TeamDraft - Player Detail</title>
			</Head>
			{!loading ? <PlayerDetail player={player} /> : <CircularProgress />}
		</>
	);
};

export default PlayerDetailPage;
