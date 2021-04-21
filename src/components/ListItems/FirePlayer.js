import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import EditModal from "../Modals/EditModal";
import { useRosterDispatch, removePlayer } from "../../contexts/roster";

const FirePlayer = ({ player }) => {
    const dispatch = useRosterDispatch();

    // Handle Edit Modal
    const [editModal, setEditModal] = React.useState(false);
    const toggleModal = () => {
        setEditModal(!editModal);
    };
    const handleUpdateRecord = () => {
        toggleModal();
        removePlayer(dispatch, player);
    };

    return (
        <>
            <EditModal
                open={editModal}
                title="Fire Player"
                message={`Are you sure you want to fire this player? Once fired, players are gone for good.`}
                action="Fire"
                onConfirm={handleUpdateRecord}
                onCancel={toggleModal}
            />
            <ListItem button onClick={toggleModal}>
                <ListItemText primary="Fire Player" />
            </ListItem>
        </>
    );
};

export default FirePlayer;
