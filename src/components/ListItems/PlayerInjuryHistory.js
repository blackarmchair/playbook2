import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    FormGroup,
    FormControlLabel,
    TextField,
    Switch,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EditModal from "../Modals/EditModal";
import {
    useRosterDispatch,
    updatePlayerInjuryStatus,
} from "../../contexts/roster";

const PlayerInjuryHistory = ({ player }) => {
    // Player Injury Status
    const [nigglingInjuries, setNigglingInjuries] = React.useState(
        parseInt(player.nigglingInjuries) || 0
    );
    const [missNextGame, setMissNextGame] = React.useState(
        Boolean(player.missNextGame)
    );

    // Handle Modal State
    const [editModal, setEditModal] = React.useState(false);
    const handleToggle = () => {
        setEditModal(!editModal);
    };

    const dispatch = useRosterDispatch();
    const handleUpdate = () => {
        handleToggle();
        updatePlayerInjuryStatus(
            dispatch,
            player,
            nigglingInjuries,
            missNextGame
        );
    };

    return (
        <>
            <EditModal
                open={editModal}
                title="Change Player Name"
                message="Enter a name for the player."
                action="Save"
                onConfirm={handleUpdate}
                onCancel={handleToggle}
            >
                <>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={missNextGame}
                                    onChange={(event) =>
                                        setMissNextGame(event.target.checked)
                                    }
                                />
                            }
                            label="Miss Next Game"
                        />
                    </FormGroup>
                    <TextField
                        variant="filled"
                        label="Niggling Injuries"
                        type="number"
                        onChange={(event) =>
                            setNigglingInjuries(event.target.value)
                        }
                    />
                </>
            </EditModal>
            <ListItem button onClick={handleToggle}>
                <ListItemText
                    primary={
                        player.hasOwnProperty("missNextGame") &&
                        player.missNextGame
                            ? "Injured"
                            : "Healthy"
                    }
                    secondary="Injury Status"
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={handleToggle}>
                        <EditIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem button onClick={handleToggle}>
                <ListItemText
                    primary={
                        player.hasOwnProperty("nigglingInjuries")
                            ? player.nigglingInjuries
                            : 0
                    }
                    secondary="Niggling Injuries"
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

export default PlayerInjuryHistory;
