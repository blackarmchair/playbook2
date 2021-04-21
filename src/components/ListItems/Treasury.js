import React from "react";
import { TextField, ListItem, ListItemText } from "@material-ui/core";
import EditModal from "../Modals/EditModal";
import {
    useRosterState,
    useRosterDispatch,
    updateTreasury,
} from "../../contexts/roster";
import * as Formatters from "../../helpers/formatters";

const Treasury = () => {
    const { treasury } = useRosterState();
    const dispatch = useRosterDispatch();

    // Handle Radio Button Select
    const [value, setValue] = React.useState(treasury);
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    // Handle Edit Modal
    const [editModal, setEditModal] = React.useState(false);
    const toggleModal = () => {
        setEditModal(!editModal);
    };
    const handleUpdateRecord = () => {
        toggleModal();
        updateTreasury(dispatch, value);
    };

    return (
        <>
            <EditModal
                open={editModal}
                title="Update Treasury"
                message="Enter a new treasury value."
                action="Update"
                onConfirm={handleUpdateRecord}
                onCancel={toggleModal}
            >
                <TextField
                    label="Treasury"
                    variant="filled"
                    value={Formatters.parseNumber(value)}
                    onChange={handleChange}
                />
            </EditModal>
            <ListItem button onClick={toggleModal}>
                <ListItemText
                    primary="Treasury"
                    secondary={`${Formatters.parseNumber(treasury)}g`}
                />
            </ListItem>
        </>
    );
};

export default Treasury;
