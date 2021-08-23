import React from 'react';
import { useRouter } from 'next/router';
import {
	Container,
	Card,
	CardContent,
	CardActions,
	Typography,
	Button,
	makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	drawer: {
		height: '100vh',
	},
	outerContainer: {
		paddingTop: theme.spacing(2),
	},
	pageCard: {
		marginTop: theme.spacing(2),
	},
}));

const HomePage = (props) => {
	const classes = useStyles();
	const router = useRouter();

	const PageCard = (pageData) => {
		const { title, message, cta, path } = pageData;
		return (
			<Card className={classes.pageCard} key={title}>
				<CardContent>
					<Typography variant="h5">{title}</Typography>
					<Typography>{message}</Typography>
				</CardContent>
				<CardActions>
					<Button onClick={() => router.push(path)}>{cta}</Button>
				</CardActions>
			</Card>
		);
	};

	const pages = [
		{
			title: 'Rosters',
			message: 'View rosters from around the league.',
			cta: 'View Rosters',
			path: '/rosterList',
		},
		{
			title: 'Create A New Roster',
			message: 'Create a new team roster',
			cta: 'Create New Roster',
			path: '/create',
		},
	];

	return (
		<Container className={classes.outerContainer}>
			{pages.map((page) => PageCard(page))}
		</Container>
	);
};

export default HomePage;
