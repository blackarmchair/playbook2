import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { useRosterDispatch, updatePlayerStats } from "../../contexts/roster";
import { STATS } from "../../helpers/playerStatsUpdate";

const SPP = ({ player }) => {
    const dispatch = useRosterDispatch();

    return STATS.map((stat) => {
        const currentStatCount = player.hasOwnProperty("stats")
            ? player.stats[stat.name]
            : 0;
        return (
            <ListItem key={stat.label}>
                <ListItemText primary={`${currentStatCount}x ${stat.label}`} />
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={() =>
                            updatePlayerStats(dispatch, player, stat)
                        }
                    >
                        <AddCircleIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    });
};

export default SPP;
