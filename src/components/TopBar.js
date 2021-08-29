import React from 'react';
import { useRouter } from 'next/router';
import {
	AppBar,
	Toolbar,
	Typography,
	Drawer,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LOCAL from '../helpers/local';

const useStyles = makeStyles((theme) => ({
	drawer: {
		[theme.breakpoints.down('sm')]: { width: '66vw' },
		[theme.breakpoints.up('sm')]: { width: '25vw' },
		backgroundColor: theme.palette.background.default,
		flexShrink: 0,
	},
	drawerPaper: {
		[theme.breakpoints.down('sm')]: { width: '66vw' },
		[theme.breakpoints.up('sm')]: { width: '25vw' },
		backgroundColor: theme.palette.background.default,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
}));

const TopBar = () => {
	const classes = useStyles();
	const router = useRouter();

	// Handle Navigation Drawer
	const [open, setOpen] = React.useState(false);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	const handleNavigation = (path) => {
		handleDrawerClose();
		router.push(path);
	};

	const handleLogout = () => {
		LOCAL.clear();
		handleNavigation('/signin');
	};

	return (
		<>
			<AppBar position="sticky">
				<Toolbar>
					<IconButton onClick={handleDrawerOpen} color="inherit">
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						onClick={() => handleNavigation('/rosterList')}
					>
						TeamDraft
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="persistent"
				anchor="left"
				open={open}
				className={classes.drawer}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem button onClick={() => handleNavigation('/rosterList')}>
						<ListItemIcon>
							<VisibilityIcon />
						</ListItemIcon>
						<ListItemText primary="Teams" />
					</ListItem>
					<ListItem button onClick={() => handleNavigation('/schedule')}>
						<ListItemIcon>
							<DateRangeIcon />
						</ListItemIcon>
						<ListItemText primary="Schedule" />
					</ListItem>
					<ListItem button onClick={() => handleLogout()}>
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary="Logout" />
					</ListItem>
				</List>
			</Drawer>
		</>
	);
};

export default TopBar;
