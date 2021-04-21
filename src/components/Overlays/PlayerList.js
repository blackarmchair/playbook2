import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import { useTeamState } from "../../contexts/team";
import {
    useRosterState,
    useRosterDispatch,
    addPlayer,
} from "../../contexts/roster";
import * as Sorters from "../../helpers/sorters";

const useStyles = makeStyles((theme) => ({
    headline: { flexGrow: 1 },
    list: { paddingTop: 0 },
    disabled: { color: theme.palette.text.disabled },
    white: { color: theme.palette.common.white },
}));

const PlayerList = (props) => {
    const classes = useStyles();

    // Team Data
    const { teams } = useTeamState();

    // Roster Data
    const { teamId, players: rosteredPlayers } = useRosterState();
    const dispatch = useRosterDispatch();
    const players = teams.find((team) => team.id === teamId)?.players || [];
    const handleAddPlayer = (player) => {
        addPlayer(dispatch, player);
    };

    return (
        <List className={classes.list}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" className={classes.headline}>
                        Players
                    </Typography>
                    <IconButton onClick={props.handleClose}>
                        <CancelIcon className={classes.white} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Divider />
            {Sorters.alphaSort(players, "position").map((player) => {
                const numOnRoster = rosteredPlayers
                    .filter(({ position }) => player.position === position)
                    .reduce((acc) => acc + 1, 0);
                return (
                    <div key={player.id}>
                        <ListItem
                            button
                            onClick={() => handleAddPlayer(player)}
                        >
                            <ListItemText
                                primary={`${
                                    numOnRoster ? `${numOnRoster}x` : ""
                                } ${player.position}`}
                                className={!numOnRoster ? classes.disabled : ""}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => handleAddPlayer(player)}
                                >
                                    <AddIcon color="secondary" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </div>
                );
            })}
        </List>
    );
};

export default PlayerList;
