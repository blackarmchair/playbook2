import * as React from "react";
import { database } from "../services/fire";

const TeamStateContext = React.createContext();
const TeamDispatchContext = React.createContext();

function teamReducer(state, action) {
    switch (action.type) {
        case "TEAM/SET_TEAMS": {
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
        throw new Error("useTeamState must be used within a TeamProvider");
    }
    return ctx;
}
function useTeamDispatch() {
    const ctx = React.useContext(TeamDispatchContext);
    if (ctx === undefined) {
        throw new Error("useTeamDispatch must be used within a TeamProvider");
    }
    return ctx;
}

async function fetchTeams(dispatch) {
    try {
        const teamSnapshot = await database.collection("teams").get();
        const playersSnapshot = await database.collection("players").get();
        const teams = teamSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        const players = playersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        dispatch({
            type: "TEAM/SET_TEAMS",
            teams: teams.map((team) => ({
                ...team,
                players: players.filter(
                    (player) => player.team === `${team.name} Teams`
                ),
            })),
        });
    } catch {
        dispatch({ type: "TEAM/SET_TEAMS", teams: [] });
    }
}

export { TeamProvider, useTeamState, useTeamDispatch, fetchTeams };
