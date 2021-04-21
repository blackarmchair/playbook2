import React from "react";
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Typography,
    SwipeableDrawer,
    makeStyles,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as Formatters from "../../helpers/formatters";
import {
    useRosterDispatch,
    removePlayer,
    addPlayer,
} from "../../contexts/roster";
import EditPlayer from "../Overlays/EditPlayer";

const useStyles = makeStyles((theme) => ({
    drawer: {
        [theme.breakpoints.up("sm")]: {
            width: "75vw",
            maxWidth: 840,
        },
        [theme.breakpoints.down("sm")]: {
            width: "100vw",
        },
    },
    playerTextLeft: {
        maxWidth: "66%",
    },
    secondaryActions: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
}));

const PlayerDisplay = (props) => {
    const classes = useStyles();
    const { position, cost, skills } = props.player;

    // Handle Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Roster Data
    const dispatch = useRosterDispatch();
    const handleDuplicatePlayer = () => {
        handleClose();
        addPlayer(dispatch, props.player);
    };
    const handleRemovePlayer = () => {
        handleClose();
        removePlayer(dispatch, props.player);
    };

    // Handle Menu
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onOpen={toggleDrawer}
                onClose={toggleDrawer}
                classes={{ paper: classes.drawer }}
            >
                <EditPlayer player={props.player} onClose={toggleDrawer} />
            </SwipeableDrawer>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={toggleDrawer}>Edit</MenuItem>
                <MenuItem onClick={handleDuplicatePlayer}>Duplicate</MenuItem>
                <MenuItem onClick={handleRemovePlayer}>Remove</MenuItem>
            </Menu>
            <ListItem button onClick={toggleDrawer}>
                <ListItemText
                    primary={
                        props.player.hasOwnProperty("name")
                            ? `#${props.player.number || "00"} ${
                                  props.player.name
                              }`
                            : position
                    }
                    secondary={
                        <>
                            {props.player.hasOwnProperty("name") ? (
                                <>
                                    {position}
                                    <br />
                                </>
                            ) : null}
                            {skills.split(",").join(", ")}
                        </>
                    }
                    className={classes.playerTextLeft}
                />
                <ListItemSecondaryAction className={classes.secondaryActions}>
                    <Typography variant="body1">
                        {`${Formatters.parseNumber(cost)}g`}
                    </Typography>
                    <IconButton onClick={handleClick}>
                        <MoreVertIcon color="secondary" />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
        </>
    );
};

export default PlayerDisplay;
