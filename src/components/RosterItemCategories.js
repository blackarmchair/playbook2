import React from 'react';
import { useRouter } from 'next/router';
import {
	SwipeableDrawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Typography,
	Divider,
	makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useRosterState } from '../contexts/roster';
import * as Formatters from '../helpers/formatters';
import * as Sorters from '../helpers/sorters';
import PlayerList from './Overlays/PlayerList';
import MiscItemList from './Overlays/MiscItemList';
import PlayerDisplay from './ListItems/PlayerDisplay';
import ItemDisplay from './ListItems/ItemDisplay';
import TeamRecord from './ListItems/TeamRecord';
import Treasury from './ListItems/Treasury';

const useStyles = makeStyles((theme) => ({
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: '75vw',
			maxWidth: 840,
		},
		[theme.breakpoints.down('sm')]: {
			width: '100vw',
		},
	},
	topItem: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
	},
	listItem: {
		color: theme.palette.secondary.contrastText,
		backgroundColor: theme.palette.secondary.main,
		borderTop: theme.palette.secondary.main,
		borderBottom: theme.palette.secondary.main,
		marginBottom: theme.spacing(2),
	},
	icon: {
		color: theme.palette.secondary.contrastText,
	},
	secondaryContrast: {
		color: theme.palette.secondary.contrastText,
	},
	secondaryActions: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		color: theme.palette.secondary.contrastText,
	},
}));

const CATEGORIES = {
	PLAYER: 'PLAYER',
	ITEM: 'ITEM',
};

const RosterItemCatagories = () => {
	const classes = useStyles();
	const router = useRouter();

	const [open, setOpen] = React.useState(false);
	const [category, setCategory] = React.useState('');
	const toggleDrawer = (category) => {
		if (open) {
			setOpen(false);
			setCategory('');
		} else {
			setCategory(category);
			setOpen(true);
		}
	};

	const {
		teamId,
		items,
		players,
		teamName,
		teamLabel,
		value,
		uuid,
		leagueHasStarted,
	} = useRosterState();

	return teamId ? (
		<>
			<SwipeableDrawer
				anchor="right"
				open={open}
				onOpen={toggleDrawer}
				onClose={toggleDrawer}
				classes={{ paper: classes.drawer }}
			>
				{category === CATEGORIES.PLAYER && (
					<PlayerList handleClose={toggleDrawer} />
				)}
				{category === CATEGORIES.ITEM && (
					<MiscItemList handleClose={toggleDrawer} />
				)}
			</SwipeableDrawer>
			<List>
				<ListItem className={classes.topItem}>
					<ListItemText
						primary={teamLabel}
						secondary={`${teamName} Team`}
						classes={{ secondary: classes.secondaryContrast }}
					/>
					<ListItemSecondaryAction>
						<IconButton onClick={() => router.push(`/view/${uuid}`)}>
							<VisibilityIcon className={classes.icon} />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>

				{/* Players */}
				<ListItem className={classes.listItem}>
					<ListItemText
						primary="Players"
						secondary={`(${players.length}) players`}
						classes={{ secondary: classes.secondaryContrast }}
					/>
					<ListItemSecondaryAction className={classes.secondaryActions}>
						<Typography variant="body1">
							{Formatters.parseNumber(
								players.reduce((acc, player) => acc + player.cost, 0)
							)}
							g
						</Typography>
						<IconButton
							onClick={() => toggleDrawer(CATEGORIES.PLAYER)}
							disabled={!Boolean(teamId)}
						>
							<AddIcon className={classes.icon} />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
				{Sorters.alphaSort(players, 'position').map((player) => (
					<PlayerDisplay key={player.id} player={player} />
				))}

				{/* Fans, Staff & Coaching */}
				<ListItem className={classes.listItem}>
					<ListItemText primary="Staff, Fans, &amp; Coaching" />
					<ListItemSecondaryAction className={classes.secondaryActions}>
						<Typography variant="body1">
							{Formatters.parseNumber(
								Object.keys(items).reduce((acc, key) => {
									const item = items[key];
									return acc + item.value * item.qty;
								}, 0)
							)}
							g
						</Typography>
						<IconButton
							onClick={() => toggleDrawer(CATEGORIES.ITEM)}
							disabled={!Boolean(teamId)}
						>
							<AddIcon className={classes.icon} />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
				{Object.keys(items).map((key) => (
					<ItemDisplay
						item={items[key]}
						toggleDrawer={() => toggleDrawer(CATEGORIES.ITEM)}
						key={key}
						leagueHasStarted={leagueHasStarted}
					/>
				))}

				{/* Team Stats */}
				<>
					<ListItem className={classes.listItem}>
						<ListItemText primary="Team Stats" />
					</ListItem>
					<TeamRecord />
					<Divider />
					<Treasury />
					<Divider />
					<ListItem>
						<ListItemText
							primary="Team Value"
							secondary={`${Formatters.parseNumber(value)}g`}
						/>
					</ListItem>
				</>
			</List>
		</>
	) : null;
};

export default RosterItemCatagories;
