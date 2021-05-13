import React, { useReducer } from "react";
import { Container, makeStyles } from "@material-ui/core";
import { useTeamDispatch, fetchTeams } from "../contexts/team";
import { useUserDispatch, getUserData, userReducer } from "../contexts/user";
import HomePageComponent from "../components/HomePage";

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        backgroundColor: theme.palette.background.default,
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.background.paperTransparent,
        },
        margin: 0,
        padding: 0,
        paddingTop: theme.spacing(1),
        maxWidth: "100%",
        flexGrow: 1,
    },
    innerContainer: {
        [theme.breakpoints.down("sm")]: {
            padding: 0,
        },
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.background.default,
            borderRadius: "4px",
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(2),
        },
    },
}));

function HomePage() {
    const classes = useStyles();

    const teamDispatch = useTeamDispatch();
    const userDispatch = useUserDispatch();
    React.useEffect(() => {
        fetchTeams(teamDispatch);
        getUserData(userDispatch, localStorage.getItem("userId"));
    }, [teamDispatch, userDispatch]);

    const [user, dispatch] = useReducer(userReducer);

    return (
        <Container classes={{ root: classes.outerContainer }}>
            <HomePageComponent />
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </Container>
    );
}

export default HomePage;
