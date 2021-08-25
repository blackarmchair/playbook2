import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import {
	useRosterDispatch,
	loadRoster,
	getRosters,
} from '../../contexts/roster';
import { useTeamDispatch, fetchTeams } from '../../contexts/team';
import RosterView from '../../components/RosterView';

const RosterPage = () => {
	const router = useRouter();
	const { roster } = router.query;

	const dispatch = useRosterDispatch();

	const [loading, setLoading] = React.useState(true);

	const teamDispatch = useTeamDispatch();
	React.useEffect(() => {
		fetchTeams(teamDispatch);
		getRosters().then((serverRosters) => {
			const rosterState = serverRosters.find((r) => r.uuid === roster);
			if (!!rosterState) {
				loadRoster(dispatch, rosterState);
				setLoading(false);
			}
		});
	}, [dispatch, teamDispatch, roster, router]);

	return (
		<>
			<Head>
				<title>TeamDraft - View Roster</title>
			</Head>
			{!loading ? <RosterView /> : <CircularProgress />}
		</>
	);
};

export default RosterPage;
