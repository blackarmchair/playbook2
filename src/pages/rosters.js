import React from "react";
import { useRouter } from "next/router";
import {
    Container,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    Menu,
    MenuItem,
    IconButton,
    Fab,
    Typography,
    Divider,
    makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Local from "../helpers/local";
import * as Formatters from "../helpers/formatters";
import withAuth from "../helpers/withAuth";
import { useTeamDispatch, fetchTeams } from "../contexts/team";
import { useUserDispatch, getUserData } from "../contexts/user";
import { getRosters } from "../contexts/roster";
import { getInitials } from "../helpers/formatters";

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
        margin: 0,
        padding: 0,
        paddingTop: theme.spacing(1),
        maxWidth: "100%",
        flexGrow: 1,
    },
    innerContainer: {
        [theme.breakpoints.down("sm")]: {
            padding: 0,
            margin: 0,
        },
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.background.default,
            borderRadius: "4px",
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(2),
        },
    },
    secondaryActions: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    avatarColor: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    fab: {
        position: "absolute",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

function RostersPage() {
    const classes = useStyles();
    const router = useRouter();

    const [rosters, setRosters] = React.useState([]);
    const [user, setUser] = React.useState({});
    const teamDispatch = useTeamDispatch();
    const userDispatch = useUserDispatch();
    React.useEffect(() => {
        fetchTeams(teamDispatch);
        getRosters().then((serverRosters) => {
            setRosters([...serverRosters]);
        });
        getUserData(userDispatch, localStorage.getItem("userId")).then(
            (userData) => {
                setUser(userData);
            }
        );
    }, [teamDispatch, userDispatch]);

    const [selectedRoster, setSelectedRoster] = React.useState(null);

    // Handle Extra Options Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event, roster) => {
        setAnchorEl(event.currentTarget);
        setSelectedRoster(roster);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedRoster(null);
    };

    return (
        <Container classes={{ root: classes.outerContainer }}>
            <Container classes={{ root: classes.innerContainer }}>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={() =>
                            router.push(`/view/${selectedRoster.uuid}`)
                        }
                    >
                        View
                    </MenuItem>
                    <MenuItem
                        onClick={() =>
                            router.push(`/roster/${selectedRoster.uuid}`)
                        }
                    >
                        Edit
                    </MenuItem>
                    <MenuItem onClick={() => Local.remove(selectedRoster.uuid)}>
                        Delete
                    </MenuItem>
                </Menu>
                <List>
                    {user.id &&
                        rosters.map((roster) => (
                            <div key={roster.uuid}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar
                                            className={classes.avatarColor}
                                            variant="square"
                                        >
                                            {getInitials(
                                                user.fname,
                                                user.lname
                                            )}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={roster.teamLabel}
                                        secondary={
                                            <Typography variant="caption">
                                                {`${roster.teamName} Team`}
                                                <br />
                                                {Formatters.parseNumber(
                                                    roster.value
                                                )}
                                                g
                                            </Typography>
                                        }
                                        onClick={() =>
                                            router.push(
                                                `/roster/${roster.uuid}`
                                            )
                                        }
                                    />
                                    <ListItemSecondaryAction
                                        className={classes.secondaryActions}
                                    >
                                        <IconButton
                                            onClick={(e) =>
                                                handleClick(e, roster)
                                            }
                                        >
                                            <MoreVertIcon color="primary" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                </List>
                <Fab
                    color="primary"
                    onClick={() => router.push("/create")}
                    className={classes.fab}
                >
                    <AddIcon />
                </Fab>
            </Container>
        </Container>
    );
}

export default withAuth(RostersPage);
