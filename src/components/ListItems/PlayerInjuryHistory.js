import React from 'react';
import {
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Switch,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
	useRosterDispatch,
	updatePlayerInjuryStatus,
} from '../../contexts/roster';

const PlayerInjuryHistory = ({ player }) => {
	// Player Injury Status
	const [nigglingInjuries, setNigglingInjuries] = React.useState(
		parseInt(player.nigglingInjuries) || 0
	);
	const addNigglingInjury = (prevState) => {
		const c = window.confirm('Add a niggling injury?');
		console.log(nigglingInjuries);
		if (c) {
			const newNIValue = nigglingInjuries + 1;
			setNigglingInjuries(newNIValue);
			updatePlayerInjuryStatus(dispatch, player, newNIValue, missNextGame);
		}
	};

	const [missNextGame, setMissNextGame] = React.useState(
		Boolean(player.missNextGame)
	);
	const handleInjuryToggle = () => {
		setMissNextGame(!missNextGame);
		updatePlayerInjuryStatus(dispatch, player, nigglingInjuries, !missNextGame);
	};

	const dispatch = useRosterDispatch();

	const playerIsInjured =
		player.hasOwnProperty('missNextGame') && player.missNextGame
			? 'Injured'
			: 'Healthy';

	return (
		<>
			<ListItem button>
				<ListItemText primary={playerIsInjured} secondary="Injury Status" />
				<ListItemSecondaryAction>
					<Switch checked={!missNextGame} onChange={handleInjuryToggle} />
				</ListItemSecondaryAction>
			</ListItem>
			<ListItem button>
				<ListItemText
					primary={
						player.hasOwnProperty('nigglingInjuries')
							? player.nigglingInjuries
							: 0
					}
					secondary="Niggling Injuries"
				/>
				<ListItemSecondaryAction>
					<IconButton color="primary" onClick={addNigglingInjury}>
						<AddCircleIcon />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		</>
	);
};

export default PlayerInjuryHistory;
