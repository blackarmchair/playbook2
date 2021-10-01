import React from 'react';
import Head from 'next/head';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { database } from '../services/fire';
import LOCAL from '../helpers/local';
import Graveyard from '../components/Graveyard';

const useStyles = makeStyles((theme) => ({
	outerContainer: {
		backgroundColor: theme.palette.background.default,
		[theme.breakpoints.up('sm')]: {
			backgroundColor: theme.palette.background.paperTransparent,
		},
		margin: 0,
		padding: 0,
		paddingTop: theme.spacing(1),
		maxWidth: '100%',
		flexGrow: 1,
	},
	innerContainer: {
		[theme.breakpoints.down('sm')]: {
			padding: 0,
		},
		[theme.breakpoints.up('sm')]: {
			backgroundColor: theme.palette.background.default,
			borderRadius: '4px',
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(2),
			padding: theme.spacing(2),
		},
	},
}));

function HomePage() {
	const classes = useStyles();
	const [deadPlayers, setDeadPlayers] = React.useState([]);
	React.useEffect(() => {
		getDeadPlayers();
		async function getDeadPlayers() {
			try {
				const dead = [];
				const deadSnapshot = await database.collection('graveyard').get();
				const deadDocs = deadSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				let rosters = LOCAL.read('rosters') || [];
				if (!Array.isArray(rosters) || !rosters.length) {
					console.log('fetching...');
					rosters = await database.collection('rosters2').get();
				}

				deadDocs.forEach((deadPlayer) => {
					const update = {
						...deadPlayer,
						rosterName:
							rosters.find((roster) => roster.uuid === deadPlayer.rosterId)
								?.teamLabel || '',
					};
					dead.push(update);
				});

				setDeadPlayers(dead);
			} catch (e) {
				console.log(e);
				setDeadPlayers([]);
			}
		}
	}, []);

	return (
		<>
			<Head>
				<title>TeamDraft - Schedule</title>
			</Head>
			<Container classes={{ root: classes.outerContainer }}>
				<Graveyard players={deadPlayers} />
			</Container>
		</>
	);
}

export default HomePage;
