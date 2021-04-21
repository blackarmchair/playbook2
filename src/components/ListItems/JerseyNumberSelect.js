import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EditModal from "../Modals/EditModal";
import { useRosterDispatch, setPlayerNumber } from "../../contexts/roster";

const JerseyNumberSelect = ({ player }) => {
    // Hold Player Name Value
    const [playerNumber, setNumber] = React.useState("");
    const handleNameUpdate = (event) => {
        setNumber(event.target.value);
    };

    // Handle Modal State
    const [editModal, setEditModal] = React.useState(false);
    const handleToggle = () => {
        setEditModal(!editModal);
    };

    // Handle Player Updates
    const dispatch = useRosterDispatch();
    const handleChange = () => {
        handleToggle();
        setPlayerNumber(dispatch, player, playerNumber);
    };

    return (
        <>
            <EditModal
                open={editModal}
                title="Change Player Nuber"
                message="Enter a jersey number for the player."
                action="Save"
                onConfirm={handleChange}
                onCancel={handleToggle}
            >
                <TextField
                    variant="filled"
                    label="Player Number"
                    onChange={(event) => handleNameUpdate(event)}
                />
            </EditModal>
            <ListItem button onClick={handleToggle}>
                <ListItemText
                    primary={player.number || "00"}
                    secondary="Jersery Number"
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={handleToggle}>
                        <EditIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </>
    );
};

export default JerseyNumberSelect;
