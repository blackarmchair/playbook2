import React from 'react';
import {
	SwipeableDrawer,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Radio,
	AppBar,
	Toolbar,
	Typography,
	Button,
	IconButton,
	makeStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useRosterDispatch, updatePlayer } from '../../contexts/roster';
import { ADVANCEMENT_COSTS } from '../../helpers/playerValuation';
import { LEVELS } from '../../helpers/playerStatsUpdate';
import * as Sorters from '../../helpers/sorters';

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
	headline: { flexGrow: 1 },
	white: { color: theme.palette.common.white },
	list: { paddingTop: 0 },
	subheader: {
		marginTop: theme.spacing(2),
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
	},
	disabled: { color: theme.palette.text.disabled },
	button: {
		marginRight: theme.spacing(1),
	},
}));

const SkillSelect = ({ level, label, skills, player }) => {
	const classes = useStyles();

	// Player Data
	const playerPrimaries = skills.filter((skill) =>
		player.primary.split(',').includes(skill.type)
	);
	const playerSecondaries = skills.filter((skill) =>
		player.secondary.split(',').includes(skill.type)
	);
	const levelData = LEVELS.find((l) => l.level === level);
	const minimumToAdvance = levelData.randomPrimary;
	const enabled = player.SPP >= minimumToAdvance && level - player.level === 1;

	// Handle Drawer State
	const [open, setOpen] = React.useState(false);
	const toggleDrawer = () => {
		setOpen(!open);
	};
	const handleToggle = () => {
		if (enabled) {
			toggleDrawer();
		}
	};

	// Existing Player Advancements
	const advancementData = player.hasOwnProperty('advancements')
		? player.advancements.find((adv) => adv.level === level)
		: null;

	// Handle Player Updates
	const dispatch = useRosterDispatch();
	const handleChange = (skill, method = 'chosen') => {
		const skillIsPrimary = player.primary.split(',').includes(skill.type);
		const skillIsChosen = method === 'chosen';

		const cost = skillIsPrimary
			? skillIsChosen
				? ADVANCEMENT_COSTS.CHOSEN_PRIMARY
				: ADVANCEMENT_COSTS.RANDOM_PRIMARY
			: skillIsChosen
			? ADVANCEMENT_COSTS.CHOSEN_SECONDARY
			: ADVANCEMENT_COSTS.RANDOM_SECONDARY;

		const levelData = LEVELS.find((l) => l.level === level);
		const sppCost =
			levelData[
				`${skillIsChosen ? 'chosen' : 'random'}${
					skillIsPrimary ? 'Primary' : 'Secondary'
				}`
			];

		updatePlayer(dispatch, player, {
			...skill,
			cost,
			level,
			sppCost,
		});
		toggleDrawer();
	};

	// Skill Display
	const Skill = ({ skill }) => (
		<ListItem button onClick={() => handleChange(skill)} key={skill.id}>
			<ListItemText primary={`${skill.name} (${skill.type})`} />
			<ListItemSecondaryAction>
				<Button
					variant="contained"
					color="secondary"
					className={classes.button}
					onClick={() => handleChange(skill, 'random')}
				>
					Random
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => handleChange(skill, 'chosen')}
				>
					Chosen
				</Button>
			</ListItemSecondaryAction>
		</ListItem>
	);

	return (
		<>
			<ListItem button onClick={handleToggle}>
				<ListItemText
					primary={label}
					secondary={advancementData ? advancementData.name : ''}
					className={enabled ? '' : classes.disabled}
				/>
				<ListItemSecondaryAction>
					<IconButton onClick={handleToggle}>
						<Radio checked={!!advancementData} />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			<SwipeableDrawer
				anchor="right"
				open={open}
				onClose={toggleDrawer}
				onOpen={toggleDrawer}
				classes={{ paper: classes.drawer }}
			>
				<List className={classes.list}>
					<AppBar position="sticky">
						<Toolbar>
							<Typography variant="h6" className={classes.headline}>
								{label} Skill
							</Typography>
							<IconButton onClick={toggleDrawer}>
								<CancelIcon className={classes.white} />
							</IconButton>
						</Toolbar>
					</AppBar>
					<ListItem className={classes.subheader}>
						<ListItemText primary="Primary Skills" />
					</ListItem>
					{Sorters.alphaSort(playerPrimaries, 'name')
						.filter((skill) => !player.skills.split(',').includes(skill.name))
						.map((skill) => (
							<Skill key={skill.name} skill={skill} />
						))}
					<ListItem className={classes.subheader}>
						<ListItemText primary="Secondary Skills" />
					</ListItem>
					{Sorters.alphaSort(playerSecondaries, 'name')
						.filter((skill) => !player.skills.split(',').includes(skill.name))
						.map((skill) => (
							<Skill key={skill.name} skill={skill} />
						))}
				</List>
			</SwipeableDrawer>
		</>
	);
};

export default SkillSelect;
