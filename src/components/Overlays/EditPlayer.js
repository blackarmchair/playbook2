import React from 'react';
import {
	List,
	ListItem,
	ListItemText,
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	makeStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { database } from '../../services/fire';
import { LEVELS } from '../../helpers/playerStatsUpdate';
import * as Formatters from '../../helpers/formatters';
import LOCAL from '../../helpers/local';

import NameSelect from '../ListItems/NameSelect';
import JerseyNumberSelect from '../ListItems/JerseyNumberSelect';
import SkillSelect from '../ListItems/SkillSelect';
import PlayerInjuryHistory from '../ListItems/PlayerInjuryHistory';
import Stats from '../ListItems/spp';
import FirePlayer from '../ListItems/FirePlayer';

const useStyles = makeStyles((theme) => ({
	headline: { flexGrow: 1 },
	list: { paddingTop: 0 },
	disabled: { color: theme.palette.text.disabled },
	white: { color: theme.palette.common.white },
	listItem: {
		color: theme.palette.secondary.contrastText,
		backgroundColor: theme.palette.secondary.main,
		borderTop: theme.palette.secondary.main,
		borderBottom: theme.palette.secondary.main,
		marginTop: theme.spacing(2),
	},
}));

const EditPlayer = (props) => {
	const classes = useStyles();

	// Get Skill Data
	const [skills, setSkills] = React.useState([]);
	React.useEffect(() => {
		async function fetchSkills() {
			const snapshot = await database.collection('skills').get();
			const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			LOCAL.set('skills', docs);
			setSkills(docs);
		}

		let skills = LOCAL.read('skills') || [];
		if (!Array.isArray(skills) || !skills.length) {
			fetchSkills();
		} else {
			setSkills(skills);
		}
	}, []);
	return (
		<List className={classes.list}>
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6" className={classes.headline}>
						{props.player.hasOwnProperty('name')
							? `${props.player.name} - ${props.player.position}`
							: props.player.position}
					</Typography>
					<IconButton onClick={props.onClose}>
						<CancelIcon className={classes.white} />
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* Player Metadata */}
			<ListItem className={classes.listItem}>
				<ListItemText primary="Player Name &amp; Number" />
			</ListItem>
			<NameSelect player={props.player} />
			<JerseyNumberSelect player={props.player} />
			<ListItem>
				<ListItemText
					primary={props.player.position}
					secondary="Player Position"
				/>
			</ListItem>

			{/* Starting Skills */}
			<ListItem className={classes.listItem}>
				<ListItemText primary="Starting Skills" />
			</ListItem>
			{skills
				.filter((skill) => props.player.skills.split(',').includes(skill.name))
				.map((skill) => (
					<ListItem key={skill.name}>
						<ListItemText primary={skill.name} />
					</ListItem>
				))}

			{/* Stats and Star Player Points */}
			<>
				<ListItem className={classes.listItem}>
					<ListItemText primary="Stats &amp; Star Player Points" />
				</ListItem>
				<ListItem>
					<ListItemText
						primary={props.player.SPP || 0}
						secondary="Star Player Points"
					/>
				</ListItem>
				<Stats player={props.player} />
			</>

			{/* Advancements */}
			<ListItem className={classes.listItem}>
				<ListItemText primary="Advancements" />
			</ListItem>
			{LEVELS.map(({ level, label }) => (
				<SkillSelect
					key={label}
					level={level}
					label={label}
					skills={skills}
					player={props.player}
				/>
			))}

			{/* Injury History */}
			<ListItem className={classes.listItem}>
				<ListItemText primary="Injury History" />
			</ListItem>
			<PlayerInjuryHistory player={props.player} />

			{/* Player Misc */}
			<ListItem className={classes.listItem}>
				<ListItemText primary="Miscellaneous" />
			</ListItem>
			<ListItem>
				<ListItemText
					primary={`${Formatters.parseNumber(props.player.cost)}g`}
					secondary="Player Value"
				/>
			</ListItem>
			<FirePlayer player={props.player} />
		</List>
	);
};

export default EditPlayer;
