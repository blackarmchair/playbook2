import React from "react";
import { Select, MenuItem } from "@material-ui/core";
import EditPropertyModal from "./Modals/EditModal";
import LOCAL from "../helpers/local";
import { useRosterDispatch, loadRoster } from "../contexts/roster";

const LoadRosterModal = (props) => {
    const rosters = LOCAL.getRosters();
    const dispatch = useRosterDispatch();

    const [selectedRoster, setSelectedRoster] = React.useState({});
    const handleChange = (event) => {
        const roster = rosters.find((r) => r.uuid === event.target.value);
        setSelectedRoster(roster);
    };
    const handleSave = () => {
        loadRoster(dispatch, selectedRoster);
        props.onCancel();
    };

    return (
        <EditPropertyModal
            open={props.open}
            title="Load a Roster"
            message="Select a previously saved roster to load."
            action="Load"
            onConfirm={handleSave}
            onCancel={props.onCancel}
        >
            <Select value={selectedRoster.uuid} onChange={handleChange}>
                {rosters.map((roster) => (
                    <MenuItem key={roster.uuid} value={roster.uuid}>
                        {roster.teamLabel}
                    </MenuItem>
                ))}
            </Select>
        </EditPropertyModal>
    );
};

export default LoadRosterModal;
