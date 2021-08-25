import React from 'react';
import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';
import { useRouter } from 'next/router';
import {
	useRosterDispatch,
	loadRoster,
	getRosters,
} from '../../contexts/roster';
import { useTeamDispatch, fetchTeams } from '../../contexts/team';
import RosterItemCatagories from '../../components/RosterItemCategories';
import Local from '../../helpers/local';

const RosterPage = () => {
	const router = useRouter();
	const { roster } = router.query;

	const dispatch = useRosterDispatch();

	const [loading, setLoading] = React.useState(true);

	const teamDispatch = useTeamDispatch();
	React.useEffect(() => {
		fetchTeams(teamDispatch);
		getRosters().then((serverRosters) => {
			const localRosters = Local.getRosters();
			const rosterState = [...localRosters, ...serverRosters].find(
				(r) => r.uuid === roster
			);
			if (!!rosterState) {
				loadRoster(dispatch, rosterState);
				setLoading(false);
			}
		});
	}, [dispatch, teamDispatch, roster, router]);

	return (
		<>
			<Head>
				<title>TeamDraft - Edit Roster</title>
			</Head>
			{!loading ? <RosterItemCatagories /> : <CircularProgress />}
		</>
	);
};

export default RosterPage;
