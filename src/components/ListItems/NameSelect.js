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
import { useRosterDispatch, setPlayerName } from "../../contexts/roster";

const SkillSelect = ({ player }) => {
    // Hold Player Name Value
    const [playerName, setName] = React.useState("");
    const handleNameUpdate = (event) => {
        setName(event.target.value);
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
        setPlayerName(dispatch, player, playerName);
    };

    return (
        <>
            <EditModal
                open={editModal}
                title="Change Player Name"
                message="Enter a name for the player."
                action="Save"
                onConfirm={handleChange}
                onCancel={handleToggle}
            >
                <TextField
                    variant="filled"
                    label="Player Name"
                    onChange={(event) => handleNameUpdate(event)}
                />
            </EditModal>
            <ListItem button onClick={handleToggle}>
                <ListItemText
                    primary={player.name || "[No Name]"}
                    secondary="Player Name"
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

export default SkillSelect;
