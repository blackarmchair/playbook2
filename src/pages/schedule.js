import React from 'react';
import Head from 'next/head';
import { Container, makeStyles } from '@material-ui/core';
import Schedule from '../components/Schedule';

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

	return (
		<>
			<Head>
				<title>TeamDraft - Schedule</title>
			</Head>
			<Container classes={{ root: classes.outerContainer }}>
				<Schedule />
			</Container>
		</>
	);
}

export default HomePage;
