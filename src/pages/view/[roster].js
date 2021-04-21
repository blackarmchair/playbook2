import React from "react";
import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import {
    useRosterDispatch,
    loadRoster,
    getRosters,
} from "../../contexts/roster";
import { useTeamDispatch, fetchTeams } from "../../contexts/team";
import RosterView from "../../components/RosterView";
import Local from "../../helpers/local";

const RosterPage = () => {
    const router = useRouter();
    const { roster } = router.query;

    const dispatch = useRosterDispatch();

    const [loading, setLoading] = React.useState(true);

    const teamDispatch = useTeamDispatch();
    React.useEffect(() => {
        fetchTeams(teamDispatch);
        getRosters().then((serverRosters) => {
            const localRosters = Local.getRosters().filter((r) => {
                const isDupe = serverRosters.find(
                    (serverRoster) => serverRoster.uuid !== r.uuid
                );
                return !!isDupe;
            });
            const fullSet = [...localRosters, ...serverRosters];
            const rosterState = fullSet.find((r) => r.uuid === roster);
            if (!!rosterState) {
                console.log([...localRosters, ...serverRosters]);
                loadRoster(dispatch, rosterState);
                setLoading(false);
            }
        });
    }, [dispatch, teamDispatch, roster, router]);

    return !loading ? <RosterView /> : <CircularProgress />;
};

export default RosterPage;
