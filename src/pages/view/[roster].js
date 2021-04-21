import React from "react";
import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import { useRosterDispatch, loadRoster } from "../../contexts/roster";
import RosterView from "../../components/RosterView";
import Local from "../../helpers/local";

const RosterPage = () => {
    const router = useRouter();
    const { roster } = router.query;

    const dispatch = useRosterDispatch();

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const rosters = Local.getRosters();
        const rosterState = rosters.find((r) => r.uuid === roster);
        if (!!rosterState) {
            loadRoster(dispatch, rosterState);
            setLoading(false);
        }
    }, [dispatch, roster, router]);

    return !loading ? <RosterView /> : <CircularProgress />;
};

export default RosterPage;
