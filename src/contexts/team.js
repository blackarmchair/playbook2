import * as React from 'react';
import { database } from '../services/fire';
import LOCAL from '../helpers/local';

const TeamStateContext = React.createContext();
const TeamDispatchContext = React.createContext();

function teamReducer(state, action) {
	switch (action.type) {
		case 'TEAM/SET_TEAMS': {
			return { ...state, teams: action.teams };
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`);
		}
	}
}
function TeamProvider({ children }) {
	const [state, dispatch] = React.useReducer(teamReducer, { teams: [] });
	return (
		<TeamStateContext.Provider value={state}>
			<TeamDispatchContext.Provider value={dispatch}>
				{children}
			</TeamDispatchContext.Provider>
		</TeamStateContext.Provider>
	);
}

function useTeamState() {
	const ctx = React.useContext(TeamStateContext);
	if (ctx === undefined) {
		throw new Error('useTeamState must be used within a TeamProvider');
	}
	return ctx;
}
function useTeamDispatch() {
	const ctx = React.useContext(TeamDispatchContext);
	if (ctx === undefined) {
		throw new Error('useTeamDispatch must be used within a TeamProvider');
	}
	return ctx;
}

async function fetchTeams(dispatch) {
	try {
		// Fetch Teams
		let teams = LOCAL.read('teams') || [];
		let lastFetchedTeamsAt = LOCAL.read('lastFetchedTeamsAt') || -1;

		// Find Teams with Updates
		if (Array.isArray(teams) && teams.length) {
			const updatedTeamsSnapshot = await database
				.collection('teams')
				.where('lastUpdatedAt', '>', lastFetchedTeamsAt)
				.get()
				.then();
			const updatedTeams = updatedTeamsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			updatedTeams.forEach((newTeam) => {
				const oldTeamIdx = teams.findIndex((team) => team.id === newTeam.id);
				teams[oldTeamIdx] = newTeam;
			});
		}

		// Fetch All Teams
		else {
			const allTeamsSnapshot = await database.collection('teams').get().then();
			teams = allTeamsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
		}

		// Update localstorage
		LOCAL.set('teams', teams);
		LOCAL.set('lastFetchedTeamsAt', Date.now());

		// Fetch Players
		let players = LOCAL.read('players') || [];
		let lastFetchedPlayersAt = LOCAL.read('lastFetchedPlayersAt') || -1;

		// Find Players with Updates
		if (Array.isArray(players) && players.length) {
			const updatedPlayersSnapshot = await database
				.collection('players')
				.where('lastUpdatedAt', '>', lastFetchedPlayersAt)
				.get()
				.then();
			const updatedPlayers = updatedPlayersSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			updatedPlayers.forEach((newPlayer) => {
				const oldPlayerIdx = players.findIndex(
					(player) => player.id === newPlayer.id
				);
				players[oldPlayerIdx] = newPlayer;
			});
		}

		// Fetch All Players
		else {
			const allPlayersSnapshot = await database
				.collection('players')
				.get()
				.then();
			players = allPlayersSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
		}

		// Update localStorage
		LOCAL.set('players', players);
		LOCAL.set('lastFetchedPlayersAt', Date.now());

		dispatch({
			type: 'TEAM/SET_TEAMS',
			teams: teams.map((team) => ({
				...team,
				players: players.filter(
					(player) => player.team === `${team.name} Teams`
				),
			})),
		});
	} catch {
		dispatch({ type: 'TEAM/SET_TEAMS', teams: [] });
	}
}

export { TeamProvider, useTeamState, useTeamDispatch, fetchTeams };
