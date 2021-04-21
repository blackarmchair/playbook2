import React from "react";
import { useTeamDispatch, fetchTeams } from "../contexts/team";
import SetupWizard from "../components/SetupWizard";

const CreatePage = () => {
    const teamDispatch = useTeamDispatch();
    React.useEffect(() => {
        fetchTeams(teamDispatch);
    }, [teamDispatch]);

    return <SetupWizard />;
};

export default CreatePage;
