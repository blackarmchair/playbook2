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
import AirlineSeatFlatIcon from '@material-ui/icons/AirlineSeatFlat';
import * as Formatters from '../helpers/formatters';
import { LEVELS } from '../helpers/playerStatsUpdate';

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

const RosterView = (props) => {
	const classes = useStyles();

	const Player = ({ player }) => (
		<TableRow>
			<TableCell align="right" className={classes.tableCell}>
				<AirlineSeatFlatIcon />
			</TableCell>
			<TableCell align="left" className={classes.tableCell}>
				#{player.number || '00'}: {player.name}
			</TableCell>
			<TableCell align="left" className={classes.tableCell}>
				{player.level >= 0 ? LEVELS[player.level].label : 'Novice'}{' '}
				{player.position}
			</TableCell>
			<TableCell align="right" className={classes.tableCell}>
				{Formatters.parseNumber(player.cost)}g
			</TableCell>
			<TableCell className={classes.tableCell}>
				{player.skills.split(',').join(', ').replace(/^,/, '')}
			</TableCell>
			<TableCell className={classes.tableCell}>
				{Formatters.unixStampToString(player.deathDate)}
			</TableCell>
			<TableCell className={classes.tableCell}>{player.rosterName}</TableCell>
		</TableRow>
	);

	const PlayerDisplayTable = ({ children }) => (
		<TableContainer component={Paper} className={classes.table}>
			<Table stickyHeader size="small">
				<TableHead>
					<TableRow>
						<TableCell className={classes.tableHeader} colSpan={2}>
							Name
						</TableCell>
						<TableCell className={classes.tableHeader}>Position</TableCell>
						<TableCell align="right" className={classes.tableHeader}>
							Value
						</TableCell>
						<TableCell className={classes.tableHeader}>
							Skills &amp; Traits
						</TableCell>
						<TableCell className={classes.tableHeader}>Date of Death</TableCell>
						<TableCell className={classes.tableHeader}>Roster</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{children}</TableBody>
			</Table>
		</TableContainer>
	);

	return (
		<Container className={classes.outerContainer}>
			<Typography variant="h5">Graveyard</Typography>
			<PlayerDisplayTable>
				{props.players.map((player) => (
					<Player player={player} key={player.uuid} />
				))}
			</PlayerDisplayTable>
		</Container>
	);
};

export default RosterView;
