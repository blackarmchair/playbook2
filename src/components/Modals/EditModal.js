import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from "@material-ui/core";

const EditModal = ({
    open,
    title,
    message,
    action,
    onConfirm,
    onCancel,
    children,
}) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
                {children || null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color="primary"
                    variant="contained"
                    autoFocus
                >
                    {action}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditModal;
