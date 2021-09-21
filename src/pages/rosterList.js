import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
	Container,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Fab,
	Typography,
	Divider,
	makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as Formatters from '../helpers/formatters';
import withAuth from '../helpers/withAuth';
import { useTeamDispatch, fetchTeams } from '../contexts/team';
import { useUserDispatch, getUserData, getUserList } from '../contexts/user';
import { getRosters } from '../contexts/roster';
import { getInitials } from '../helpers/formatters';
import determineStandings from '../helpers/standings';
import LOCAL from '../helpers/local';

const useStyles = makeStyles((theme) => ({
	outerContainer: {
		backgroundColor: theme.palette.background.default,
		display: 'flex',
		flexDirection: 'column',
		minHeight: 'calc(100vh - 64px)',
		margin: 0,
		padding: 0,
		paddingTop: theme.spacing(1),
		maxWidth: '100%',
		flexGrow: 1,
	},
	innerContainer: {
		[theme.breakpoints.down('sm')]: {
			padding: 0,
			margin: 0,
		},
		[theme.breakpoints.up('sm')]: {
			backgroundColor: theme.palette.background.default,
			borderRadius: '4px',
			marginTop: theme.spacing(2),
			marginBottom: theme.spacing(2),
			padding: theme.spacing(2),
		},
	},
	secondaryActions: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	avatarColor: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
	},
	avatarColorOwnTeam: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText,
	},
	fab: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

function RostersPage() {
	const classes = useStyles();
	const router = useRouter();

	const [rosters, setRosters] = React.useState([]);
	const [user, setUser] = React.useState({});
	const teamDispatch = useTeamDispatch();
	const userDispatch = useUserDispatch();
	React.useEffect(() => {
		const userId = localStorage.getItem('userId');
		getUserData(userDispatch, userId).then((userData) => {
			setUser(userData);
		});
		fetchTeams(teamDispatch);
		getUserList(userDispatch)
			.then(getRosters)
			.then((serverRosters) => {
				const users = LOCAL.read('users') || [];
				const parsedRosters = serverRosters.map((roster) => ({
					...roster,
					isOwn:
						roster.hasOwnProperty('owner') &&
						!roster.owner.localeCompare(userId),
					ownerData: users.find((user) => user.id === roster.owner),
				}));
				setRosters(parsedRosters);
			});
	}, [teamDispatch, userDispatch]);

	const handleNav = (roster) => {
		if (roster.isOwn) {
			router.push(`/roster/${roster.uuid}`);
		} else {
			router.push(`/view/${roster.uuid}`);
		}
	};

	const userLoaded = !!user && (user.id || user.uid);

	return (
		<>
			<Head>
				<title>TeamDraft - Roster List</title>
			</Head>
			<Container classes={{ root: classes.outerContainer }}>
				<Container classes={{ root: classes.innerContainer }}>
					<List>
						{userLoaded &&
							determineStandings(rosters).map((roster) => (
								<div key={roster.uuid}>
									<ListItem>
										<ListItemAvatar>
											<Avatar
												className={
													roster.isOwn
														? classes.avatarColorOwnTeam
														: classes.avatarColor
												}
												variant="square"
											>
												{getInitials(
													roster?.ownerData?.fname,
													roster?.ownerData?.lname
												) || ''}
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={roster.teamLabel}
											secondary={
												<Typography variant="caption">
													{`${roster.teamName} Team`}
													<br />
													{Formatters.parseNumber(roster.value)}g <br /> (
													{roster.record.win}/{roster.record.loss}/
													{roster.record.draw}) | LP: {roster.leaguePoints} |
													TD: {roster.touchdowns} | CAS: {roster.casualties}
												</Typography>
											}
											onClick={() => handleNav(roster)}
										/>
									</ListItem>
									<Divider />
								</div>
							))}
					</List>
					<Fab
						color="primary"
						onClick={() => router.push('/create')}
						className={classes.fab}
					>
						<AddIcon />
					</Fab>
				</Container>
			</Container>
		</>
	);
}

export default withAuth(RostersPage);
