import React from 'react';
import {
	Container,
	Paper,
	Typography,
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	makeStyles,
} from '@material-ui/core';
import SCHEDULE from '../constants/schedule.json';

const useStyles = makeStyles((theme) => ({
	drawer: {
		height: '100vh',
	},
	outerContainer: {
		paddingTop: theme.spacing(2),
	},
	table: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		maxHeight: '75vh',
	},
	tableHeader: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
	},
	tableCell: {
		backgroundColor: theme.palette.background.default,
	},
	divider: {
		marginBottom: theme.spacing(2),
	},
}));

const Schedule = (props) => {
	const classes = useStyles();

	let playerSchedules = {};
	SCHEDULE.weeks.forEach((week, i) => {
		SCHEDULE.players.forEach((player) => {
			if (!playerSchedules.hasOwnProperty(player)) {
				playerSchedules[player] = [];
			}

			const game = SCHEDULE.weeks[i].games.find((game) =>
				game.includes(player)
			);
			const opponent = game
				? game.filter((contestant) => contestant !== player)[0]
				: 'Bye';

			playerSchedules[player].push(opponent);
		});
	});

	const makeRows = () => {
		const topHeaderRows = SCHEDULE.weeks.map((week) => (
			<TableCell className={classes.tableHeader}>Week {week.index}</TableCell>
		));
		const bottomHeaderRows = SCHEDULE.weeks.map((week) => (
			<TableCell className={classes.tableHeader}>
				{week.startDate} - {week.endDate}
			</TableCell>
		));
		const bodyRows = SCHEDULE.players.map((player) => {
			return (
				<TableRow>
					<TableCell className={classes.tableHeader}>{player}</TableCell>
					{playerSchedules[player].map((opponent) => (
						<TableCell>{opponent}</TableCell>
					))}
				</TableRow>
			);
		});

		return (
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell className={classes.tableHeader} rowSpan={2}>
							BBBBC Coach
						</TableCell>
						{topHeaderRows}
					</TableRow>
					<TableRow>{bottomHeaderRows}</TableRow>
				</TableHead>
				<TableBody>{bodyRows}</TableBody>
			</Table>
		);
	};

	return (
		<Container className={classes.outerContainer}>
			<Typography variant="h5">Schedule</Typography>
			<TableContainer component={Paper} className={classes.table}>
				{makeRows()}
			</TableContainer>
		</Container>
	);
};

export default Schedule;
