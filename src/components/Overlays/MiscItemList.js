import React from "react";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import {
    useRosterState,
    useRosterDispatch,
    addItem,
} from "../../contexts/roster";

const useStyles = makeStyles((theme) => ({
    headline: { flexGrow: 1 },
    list: { paddingTop: 0 },
    disabled: { color: theme.palette.text.disabled },
    white: { color: theme.palette.common.white },
}));

const MiscItemList = (props) => {
    const classes = useStyles();

    // Roster Data
    const { items } = useRosterState();
    const dispatch = useRosterDispatch();
    const handleAddItem = (item) => {
        addItem(dispatch, item);
    };

    return (
        <List className={classes.list}>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" className={classes.headline}>
                        Miscellaneous Items
                    </Typography>
                    <IconButton onClick={props.handleClose}>
                        <CancelIcon className={classes.white} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Divider />
            {Object.keys(items).map((key) => {
                const item = items[key];
                return (
                    <div key={item.label}>
                        <ListItem
                            button
                            onClick={() => handleAddItem({ ...item, key })}
                        >
                            <ListItemText
                                primary={`${item.qty ? `${item.qty}x` : ""} ${
                                    item.label
                                }`}
                                className={!item.qty ? classes.disabled : ""}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() =>
                                        handleAddItem({ ...item, key })
                                    }
                                >
                                    <AddIcon color="secondary" />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </div>
                );
            })}
        </List>
    );
};

export default MiscItemList;
