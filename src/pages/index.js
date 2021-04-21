import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import { useTeamDispatch, fetchTeams } from "../contexts/team";
import { useRosterState } from "../contexts/roster";
import RosterItemCatagories from "../components/RosterItemCategories";
import SetupWizard from "../components/SetupWizard";

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

    const { initialized } = useRosterState();
    const teamDispatch = useTeamDispatch();
    React.useEffect(() => {
        fetchTeams(teamDispatch);
    }, [teamDispatch]);

    return (
        <Container classes={{ root: classes.outerContainer }}>
            <Container classes={{ root: classes.innerContainer }}>
                {initialized ? <RosterItemCatagories /> : <SetupWizard />}
            </Container>
        </Container>
    );
}

export default HomePage;
