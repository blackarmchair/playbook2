import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import EditModal from '../Modals/EditModal';
import { useRosterDispatch, killPlayer } from '../../contexts/roster';

const KillPlayer = ({ player }) => {
	const dispatch = useRosterDispatch();

	// Handle Edit Modal
	const [editModal, setEditModal] = React.useState(false);
	const toggleModal = () => {
		setEditModal(!editModal);
	};
	const handleUpdateRecord = () => {
		toggleModal();
		killPlayer(dispatch, player);
	};

	return (
		<>
			<EditModal
				open={editModal}
				title="Kill Player"
				message={`Are you sure this player is dead? Dead players are gone for good.`}
				action="Kill"
				onConfirm={handleUpdateRecord}
				onCancel={toggleModal}
			/>
			<ListItem button onClick={toggleModal}>
				<ListItemText primary="Kill Player" />
			</ListItem>
		</>
	);
};

export default KillPlayer;
