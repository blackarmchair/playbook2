import React from 'react';
import {
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useRosterDispatch, addLastingInjury } from '../../contexts/roster';

const AddLastingInjury = ({ player }) => {
	const dispatch = useRosterDispatch();

	const handleAddInjury = (characteristic) => {
		addLastingInjury(dispatch, characteristic, player);
	};

	const injuries = {
		AV: 0,
		MA: 0,
		PA: 0,
		AG: 0,
		ST: 0,
	};
	if (player.hasOwnProperty('lastingInjuries')) {
		player.lastingInjuries.forEach((injury) => {
			injuries[injury]++;
		});
	}

	const InjuryType = ({ label, characteristic, count }) => (
		<ListItem>
			<ListItemText
				primary={`${count}x ${label}`}
				secondary={
					count ? `-${count} ${characteristic}` : `Reduces ${characteristic}`
				}
			/>
			<ListItemSecondaryAction>
				<IconButton
					color="primary"
					onClick={() => handleAddInjury(characteristic)}
				>
					<AddCircleIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);

	return (
		<>
			<InjuryType label="Head Injury" characteristic="AV" count={injuries.AV} />
			<InjuryType
				label="Smashed Knee"
				characteristic="MA"
				count={injuries.MA}
			/>
			<InjuryType label="Broken Arm" characteristic="PA" count={injuries.PA} />
			<InjuryType label="Neck Injury" characteristic="AG" count={injuries.AG} />
			<InjuryType
				label="Dislocated Shoulder"
				characteristic="ST"
				count={injuries.ST}
			/>
		</>
	);
};

export default AddLastingInjury;
