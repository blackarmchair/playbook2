import React from 'react';
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Typography,
	Divider,
	makeStyles,
} from '@material-ui/core';
import * as Formatters from '../helpers/formatters';
import { LEVELS } from '../helpers/playerStatsUpdate';

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

const PlayerDetail = (props) => {
	const classes = useStyles();
	const {
		MA,
		ST,
		AG,
		PA,
		AV,
		skills,
		missNextGame,
		nigglingInjuries,
		number,
		level,
		stats,
		cost,
		SPP,
		name,
		advancements,
		position,
		primary,
		secondary,
		team,
	} = props.player;

	const parsedSkills = skills.split(',').map((skill) => ({
		name: skill,
		startingSkill: !advancements.find((adv) => adv.name === skill),
	}));
	const playerLevel = LEVELS[level];

	return (
		<List>
			<ListItem className={classes.topItem}>
				<ListItemText
					primary={`#${number || '00'} ${name || ''}`}
					secondary={`${playerLevel?.label || 'Novice'} ${position}`}
					classes={{ secondary: classes.secondaryContrast }}
				/>
				<ListItemSecondaryAction>
					<Typography variant="body1" className={classes.secondaryContrast}>
						{Formatters.parseNumber(cost)}g
					</Typography>
				</ListItemSecondaryAction>
			</ListItem>

			{/* Physical Characteristics */}
			<ListItem className={classes.listItem}>
				<ListItemText
					primary="Physical Characteristics"
					classes={{ secondary: classes.secondaryContrast }}
				/>
			</ListItem>
			<ListItem>
				<ListItemText primary={MA} secondary="Movement" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={ST} secondary="Strength" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={`${AG}+`} secondary="Agility" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={`${PA}+`} secondary="Passing" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={`${AV}+`} secondary="Armor Value" />
			</ListItem>

			{/* Skills & Traits */}
			<ListItem className={classes.listItem}>
				<ListItemText
					primary="Skills & Traits"
					classes={{ secondary: classes.secondaryContrast }}
				/>
			</ListItem>
			{parsedSkills.map((skill) => (
				<>
					<ListItem>
						<ListItemText
							primary={skill.name}
							secondary={skill.startingSkill ? 'Base Skill' : 'Learned Skill'}
						/>
					</ListItem>
					<Divider />
				</>
			))}

			{/* Injury History */}
			<ListItem className={classes.listItem}>
				<ListItemText
					primary="Injury History"
					classes={{ secondary: classes.secondaryContrast }}
				/>
			</ListItem>
			<ListItem>
				<ListItemText
					primary={missNextGame ? 'Injured' : 'Healthy'}
					secondary="Injury"
				/>
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText
					primary={nigglingInjuries}
					secondary="Niggling Injuries"
				/>
			</ListItem>

			{/* Stats */}
			<ListItem className={classes.listItem}>
				<ListItemText
					primary="Stats & Achievements"
					classes={{ secondary: classes.secondaryContrast }}
				/>
			</ListItem>
			<ListItem>
				<ListItemText primary={stats.CAS} secondary="Casualties" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={stats.DEF} secondary="Deflections" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={stats.INT} secondary="Interceptions" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={stats.MVP} secondary="Most Valuable Player" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={stats.PAS} secondary="Passing Completions" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={stats.TD} secondary="Touchdowns" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={stats.THR} secondary="Throwing Completions" />
			</ListItem>

			{/* Misc */}
			<ListItem className={classes.listItem}>
				<ListItemText
					primary="Miscellaneous"
					classes={{ secondary: classes.secondaryContrast }}
				/>
			</ListItem>
			<ListItem>
				<ListItemText primary={SPP} secondary="Star Player Points" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={primary} secondary="Primary Skills" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={secondary} secondary="Secondary Skills" />
			</ListItem>
			<Divider />
			<ListItem>
				<ListItemText primary={team} secondary="Plays for" />
			</ListItem>
		</List>
	);
};

export default PlayerDetail;
