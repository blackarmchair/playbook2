import React from 'react';
import { useRouter } from 'next/router';
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
	Divider,
	makeStyles,
} from '@material-ui/core';
import { useRosterState } from '../contexts/roster';
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
	const router = useRouter();

	const {
		initialized,
		items,
		players,
		teamName,
		teamLabel,
		value,
		treasury,
		record,
		leagueHasStarted,
	} = useRosterState();

	const dedicatedFans = !!items
		? Object.values(items).find((item) => item.label === 'Dedicated Fans').qty +
		  1
		: 1;

	const handleNavigation = (playerId) => {
		router.push(`/player/${playerId}`);
	};

	if (!initialized) return null;

	const Player = ({ player }) => (
		<TableRow onClick={() => handleNavigation(player.uuid)}>
			<TableCell align="right" className={classes.tableCell}>
				#{player.number || '00'}
			</TableCell>
			<TableCell align="left" className={classes.tableCell}>
				{player.name}
			</TableCell>
			<TableCell align="left" className={classes.tableCell}>
				{player.level >= 0 ? LEVELS[player.level].label : 'Novice'}{' '}
				{player.position}
			</TableCell>
			<TableCell align="left" className={classes.tableCell}>
				{player.SPP}
			</TableCell>
			<TableCell align="right" className={classes.tableCell}>
				{Formatters.parseNumber(player.cost)}g
			</TableCell>
			<TableCell align="right" className={classes.tableCell}>
				{player.MA}
			</TableCell>
			<TableCell align="right" className={classes.tableCell}>
				{player.ST}
			</TableCell>
			<TableCell align="right" className={classes.tableCell}>
				{player.AG}+
			</TableCell>
			<TableCell align="right" className={classes.tableCell}>
				{player.PA ? `${player.PA}+` : '-'}
			</TableCell>
			<TableCell align="right" className={classes.tableCell}>
				{player.AV}+
			</TableCell>
			<TableCell className={classes.tableCell}>
				{player.skills.split(',').join(', ').replace(/^,/, '')}
			</TableCell>
			<TableCell className={classes.tableCell}>
				{player.primary.split(',').join(', ')}
			</TableCell>
			<TableCell className={classes.tableCell}>
				{player.secondary.split(',').join(', ')}
			</TableCell>
			<TableCell className={classes.tableCell}>
				{player.missNextGame ? 'YES' : 'NO'}
			</TableCell>
			<TableCell className={classes.tableCell}>
				{player.nigglingInjuries}
			</TableCell>
		</TableRow>
	);

	const Item = ({ item }) => (
		<TableRow>
			<TableCell className={classes.tableCell}>{item.qty}x</TableCell>
			<TableCell className={classes.tableCell}>{item.label}</TableCell>
			<TableCell className={classes.tableCell}>
				{leagueHasStarted && item.label === 'Dedicated Fans'
					? ''
					: `${Formatters.parseNumber(item.value * item.qty)}g`}
			</TableCell>
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
						<TableCell className={classes.tableHeader}>SPP</TableCell>
						<TableCell align="right" className={classes.tableHeader}>
							Value
						</TableCell>
						<TableCell align="right" className={classes.tableHeader}>
							MA
						</TableCell>
						<TableCell align="right" className={classes.tableHeader}>
							ST
						</TableCell>
						<TableCell align="right" className={classes.tableHeader}>
							AG
						</TableCell>
						<TableCell align="right" className={classes.tableHeader}>
							PA
						</TableCell>
						<TableCell align="right" className={classes.tableHeader}>
							AV
						</TableCell>
						<TableCell className={classes.tableHeader}>
							Skills &amp; Traits
						</TableCell>
						<TableCell className={classes.tableHeader}>Primary</TableCell>
						<TableCell className={classes.tableHeader}>Secondary</TableCell>
						<TableCell className={classes.tableHeader}>
							Miss Next Game
						</TableCell>
						<TableCell className={classes.tableHeader}>
							Niggling Injuries
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{children}</TableBody>
			</Table>
		</TableContainer>
	);

	const ItemDisplayTable = ({ children }) => (
		<TableContainer component={Paper} className={classes.table}>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell className={classes.tableHeader}>Quantity</TableCell>
						<TableCell className={classes.tableHeader}>Item</TableCell>
						<TableCell className={classes.tableHeader}>Value</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{children}</TableBody>
			</Table>
		</TableContainer>
	);

	return (
		<Container className={classes.outerContainer}>
			<Typography variant="h5">{teamLabel}</Typography>
			<Typography variant="body2">{teamName} Team</Typography>
			<br />
			<Typography variant="body2">
				Team Value: {Formatters.parseNumber(value)}g
			</Typography>
			<Typography variant="body2">
				Fan Factor: {parseInt(dedicatedFans)}
			</Typography>
			<Typography variant="body2">
				Treasury: {Formatters.parseNumber(treasury)}g
			</Typography>
			<Typography variant="body2">
				Record: ({record.win}/{record.loss}/{record.draw})
			</Typography>
			<PlayerDisplayTable>
				{players.map((player) => (
					<Player player={player} key={player.uuid} />
				))}
			</PlayerDisplayTable>
			<Divider className={classes.divider} />
			<Typography variant="h6">Miscellaneous Items</Typography>
			<ItemDisplayTable>
				{Object.values(items)
					.filter((item) => item.qty)
					.map((item) => (
						<Item item={item} key={item.label} />
					))}
			</ItemDisplayTable>
		</Container>
	);
};

export default RosterView;
