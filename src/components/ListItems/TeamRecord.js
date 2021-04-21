import React from "react";
import {
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    ListItem,
    ListItemText,
} from "@material-ui/core";
import EditModal from "../Modals/EditModal";
import {
    useRosterState,
    useRosterDispatch,
    addWin,
    addLoss,
    addDraw,
} from "../../contexts/roster";

const TeamRecord = () => {
    const { record } = useRosterState();
    const dispatch = useRosterDispatch();

    // Handle Radio Button Select
    const [value, setValue] = React.useState("");
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
        if (value === "win") addWin(dispatch);
        if (value === "loss") addLoss(dispatch);
        if (value === "draw") addDraw(dispatch);
    };

    return (
        <>
            <EditModal
                open={editModal}
                title="Update Team Record"
                message="Add a game to your team record."
                action="Update"
                onConfirm={handleUpdateRecord}
                onCancel={toggleModal}
            >
                <FormControl component="fieldset">
                    <RadioGroup
                        name="updateRecord"
                        value={value}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value="win"
                            control={<Radio />}
                            label="Win"
                        />
                        <FormControlLabel
                            value="loss"
                            control={<Radio />}
                            label="Loss"
                        />
                        <FormControlLabel
                            value="draw"
                            control={<Radio />}
                            label="Draw"
                        />
                    </RadioGroup>
                </FormControl>
            </EditModal>
            <ListItem button onClick={toggleModal}>
                <ListItemText
                    primary="Record"
                    secondary={`${record.win}/${record.loss}/${record.draw}`}
                />
            </ListItem>
        </>
    );
};

export default TeamRecord;
