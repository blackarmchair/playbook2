import React from 'react';
import {
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Menu,
	MenuItem,
	Divider,
	Typography,
	makeStyles,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useRosterDispatch, addItem, removeItem } from '../../contexts/roster';
import * as Formatters from '../../helpers/formatters';

const useStyles = makeStyles((theme) => ({
	secondaryActions: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
}));

const ItemDisplay = (props) => {
	const classes = useStyles();
	const { qty, label, value } = props.item;

	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const dispatch = useRosterDispatch();
	const handleAddItem = () => {
		handleClose();
		addItem(dispatch, props.item);
	};
	const handleRemoveItem = () => {
		handleClose();
		removeItem(dispatch, props.item);
	};

	const isDedicatedFans = label === 'Dedicated Fans';

	return (
		<>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={handleAddItem}>Add</MenuItem>
				<MenuItem onClick={handleRemoveItem}>Remove</MenuItem>
			</Menu>
			<ListItem button onClick={props.toggleDrawer}>
				<ListItemText
					primary={`${qty ? `${qty}x` : ''} ${label}`}
					secondary={
						isDedicatedFans && props.leagueHasStarted
							? ''
							: `${Formatters.parseNumber(value)}g each`
					}
				/>
				<ListItemSecondaryAction className={classes.secondaryActions}>
					<Typography variant="body1">
						{isDedicatedFans && props.leagueHasStarted
							? ''
							: `${Formatters.parseNumber(qty * value)}g`}
					</Typography>
					<IconButton onClick={handleClick}>
						<MoreVertIcon color="secondary" />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			<Divider />
		</>
	);
};

export default ItemDisplay;
