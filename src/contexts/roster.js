import * as React from "react";
import UUID from "../helpers/uuid";
import UpdatePlayer from "../helpers/playerValuation";
import PlayerStatsUpdate from "../helpers/playerStatsUpdate";
import LOCAL from "../helpers/local";

// Contexts
const initialState = {
    items: {
        apothecary: { qty: 0, value: 50000, label: "Apothecary" },
        assistantCoaches: { qty: 0, value: 10000, label: "Assistant Coaches" },
        cheerleaders: { qty: 0, value: 10000, label: "Cheerleaders" },
        dedicatedFans: { qty: 0, value: 10000, label: "Dedicated Fans" },
        rerolls: { qty: 0, value: 0, label: "Re-Rolls" },
    },
    players: [],
    value: 0,
    maxValue: 1000000,
    teamId: "",
    teamName: "",
    teamLabel: "The No-Named Fools",
    leagueMode: false,
    initialized: false,
    record: {
        win: 0,
        loss: 0,
        draw: 0,
    },
    treasury: 1000000,
    leaguePoints: 0,
    uuid: UUID(),
    dateCreated: new Date().getTime(),
};
const RosterStateContext = React.createContext(initialState);
const RosterDispatchContext = React.createContext(initialState);

// Lifecycle Transactors
function rosterReducer(state, action) {
    switch (action.type) {
        case "ROSTER/INITIALIZE": {
            const newState = {
                ...state,
                initialized: !state.initialized,
            };
            save(state.leagueMode, newState);
            return newState;
        }
        case "ROSTER/SET_ROSTER": {
            return {
                ...initialState,
                items: {
                    ...Object.keys(initialState.items)
                        .filter(
                            (key) =>
                                key !== "apothecary" || action.team.apothecary
                        )
                        .map((key) => {
                            if (key === "rerolls") {
                                return {
                                    ...initialState.items.rerolls,
                                    value: action.team.rerolls.cost,
                                };
                            }
                            return initialState.items[key];
                        }),
                },
                teamId: action.team.id,
                teamName: action.team.name,
                specialRules: action.team.specialRules,
            };
        }
        case "ROSTER/LOAD": {
            return { ...action.roster };
        }
        case "ROSTER/SET_LEAGUE_MODE": {
            return {
                ...state,
                leagueMode: action.leagueMode,
            };
        }
        case "ROSTER/SET_MAX_VALUE": {
            return {
                ...state,
                maxValue: parseInt(action.maxValue),
            };
        }
        case "ROSTER/SET_TEAM_LABEL": {
            return {
                ...state,
                teamLabel: action.teamLabel,
            };
        }
        case "ROSTER/ADD_PLAYER": {
            const numOnRoster = state.players
                .filter((player) => player.position === action.player.position)
                .reduce((acc) => acc + 1, 0);

            const newTreasury =
                parseInt(state.treasury) - parseInt(action.player.cost);

            if (numOnRoster < action.player.max && newTreasury >= 0) {
                const newState = {
                    ...state,
                    players: [
                        ...state.players,
                        {
                            ...action.player,
                            id: UUID(),
                            SPP: 0,
                            level: -1,
                            stats: {
                                PAS: 0,
                                THR: 0,
                                DEF: 0,
                                INT: 0,
                                CAS: 0,
                                TD: 0,
                                MVP: 0,
                            },
                            advancements: [],
                            missNextGame: false,
                            nigglingInjuries: 0,
                        },
                    ],
                    treasury: state.leagueMode ? newTreasury : state.treasury,
                };
                save(state.leagueMode, {
                    ...newState,
                    value: rosterValuation(newState),
                });
                return {
                    ...newState,
                    value: rosterValuation(newState),
                };
            } else {
                return state;
            }
        }
        case "ROSTER/REMOVE_PLAYER": {
            const newState = {
                ...state,
                players: state.players.filter(
                    (player) => player.uuid !== action.player.uuid
                ),
                treasury: state.leagueMode
                    ? parseInt(state.treasury) + parseInt(action.player.cost)
                    : parseInt(state.treasury),
            };
            save(state.leagueMode, {
                ...newState,
                value: rosterValuation(newState),
            });
            return {
                ...newState,
                value: rosterValuation(newState),
            };
        }
        case "ROSTER/ADD_ITEM": {
            const newTreasury =
                parseInt(state.treasury) - parseInt(action.item.value);
            if (newTreasury >= 0) {
                const newState = {
                    ...state,
                    items: Object.keys(state.items).map((key) => {
                        const item = state.items[key];
                        if (item.label === action.item.label) {
                            return {
                                ...item,
                                qty: action.item.qty + 1,
                            };
                        }
                        return item;
                    }),
                    treasury: state.leagueMode ? newTreasury : state.treasury,
                };
                save(state.leagueMode, {
                    ...newState,
                    value: rosterValuation(newState),
                });
                return {
                    ...newState,
                    value: rosterValuation(newState),
                };
            } else {
                return state;
            }
        }
        case "ROSTER/REMOVE_ITEM": {
            const newState = {
                ...state,
                items: Object.keys(state.items).map((key) => {
                    const item = state.items[key];
                    if (item.label === action.item.label) {
                        return {
                            ...item,
                            qty: action.item.qty > 0 ? action.item.qty - 1 : 0,
                        };
                    }
                    return item;
                }),
                treasury:
                    parseInt(state.treasury) + parseInt(action.item.value),
            };
            save(state.leagueMode, {
                ...newState,
                value: rosterValuation(newState),
            });
            return {
                ...newState,
                value: rosterValuation(newState),
            };
        }
        case "ROSTER/UPDATE_PLAYER": {
            const newState = {
                ...state,
                players: state.players.map((player) => {
                    const { advance } = action;
                    if (player.uuid === action.player.uuid) {
                        return UpdatePlayer(player, advance);
                    }
                    return player;
                }),
            };
            save(state.leagueMode, {
                ...newState,
                value: rosterValuation(newState),
            });
            return {
                ...newState,
                value: rosterValuation(newState),
            };
        }
        case "ROSTER/UPDATE_PLAYER_STAT": {
            const newState = {
                ...state,
                players: state.players.map((player) => {
                    const { stat } = action;
                    if (player.uuid === action.player.uuid) {
                        return PlayerStatsUpdate(player, stat);
                    }
                    return player;
                }),
            };
            save(state.leagueMode, newState);
            return newState;
        }
        case "ROSTER/SET_PLAYER_NAME": {
            const newState = {
                ...state,
                players: state.players.map((player) => {
                    if (player.uuid === action.player.uuid) {
                        return { ...player, name: action.name };
                    }
                    return player;
                }),
            };
            save(state.leagueMode, newState);
            return newState;
        }
        case "ROSTER/SET_PLAYER_NUMBER": {
            const newState = {
                ...state,
                players: state.players.map((player) => {
                    if (player.uuid === action.player.uuid) {
                        return { ...player, number: action.number };
                    }
                    return player;
                }),
            };
            save(state.leagueMode, newState);
            return newState;
        }
        case "ROSTER/SET_PLAYER_INJURY_STATUS": {
            const newState = {
                ...state,
                players: state.players.map((player) => {
                    if (player.uuid === action.player.uuid) {
                        return {
                            ...player,
                            nigglingInjuries: parseInt(action.ni),
                            missNextGame: action.mng,
                        };
                    }
                    return player;
                }),
            };
            save(state.leagueMode, {
                ...newState,
                value: rosterValuation(newState),
            });
            return {
                ...newState,
                value: rosterValuation(newState),
            };
        }
        case "ROSTER/ADD_WIN": {
            const newState = {
                ...state,
                record: {
                    ...state.record,
                    win: state.record.win + 1,
                },
                leaguePoints: state.leaguePoints + 3,
            };
            save(state.leagueMode, newState);
            return newState;
        }
        case "ROSTER/ADD_LOSS": {
            const newState = {
                ...state,
                record: {
                    ...state.record,
                    loss: state.record.loss + 1,
                },
            };
            save(state.leagueMode, newState);
            return newState;
        }
        case "ROSTER/ADD_DRAW": {
            const newState = {
                ...state,
                record: {
                    ...state.record,
                    draw: state.record.draw + 1,
                },
                leaguePoints: state.leaguePoints + 1,
            };
            save(state.leagueMode, newState);
            return newState;
        }
        case "ROSTER/UPDATE_TREASURY": {
            const newState = {
                ...state,
                treasury: parseInt(action.treasury),
            };
            save(state.leagueMode, newState);
            return newState;
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}
function RosterProvider({ children }) {
    const [state, dispatch] = React.useReducer(rosterReducer, {
        players: [],
        items: [],
    });
    return (
        <RosterStateContext.Provider value={state}>
            <RosterDispatchContext.Provider value={dispatch}>
                {children}
            </RosterDispatchContext.Provider>
        </RosterStateContext.Provider>
    );
}
function useRosterState() {
    const ctx = React.useContext(RosterStateContext);
    if (ctx === undefined) {
        throw new Error("useRosterState must be used within a RosterProvider");
    }
    return ctx;
}
function useRosterDispatch() {
    const ctx = React.useContext(RosterDispatchContext);
    if (ctx === undefined) {
        throw new Error(
            "useRosterDispatch must be used within a RosterProvider"
        );
    }
    return ctx;
}

// Actions
function setRoster(dispatch, team) {
    try {
        dispatch({ type: "ROSTER/SET_ROSTER", team });
    } catch (e) {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function setMaxValue(dispatch, maxValue) {
    try {
        dispatch({ type: "ROSTER/SET_MAX_VALUE", maxValue });
    } catch (e) {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function setTeamLabel(dispatch, teamLabel) {
    try {
        dispatch({ type: "ROSTER/SET_TEAM_LABEL", teamLabel });
    } catch (e) {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function initializeRoster(dispatch) {
    try {
        dispatch({ type: "ROSTER/INITIALIZE" });
    } catch (e) {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function loadRoster(dispatch, roster) {
    try {
        dispatch({ type: "ROSTER/LOAD", roster });
    } catch (e) {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function setLeagueMode(dispatch, leagueMode) {
    try {
        dispatch({ type: "ROSTER/SET_LEAGUE_MODE", leagueMode });
    } catch (e) {
        dispatch({ type: "ROSTER/ERROR" });
    }
}

function addPlayer(dispatch, player) {
    try {
        dispatch({
            type: "ROSTER/ADD_PLAYER",
            player: { ...player, uuid: UUID() },
        });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function removePlayer(dispatch, player) {
    try {
        dispatch({ type: "ROSTER/REMOVE_PLAYER", player });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function updatePlayer(dispatch, player, advance) {
    try {
        dispatch({ type: "ROSTER/UPDATE_PLAYER", player, advance });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function setPlayerName(dispatch, player, name) {
    try {
        dispatch({ type: "ROSTER/SET_PLAYER_NAME", player, name });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function setPlayerNumber(dispatch, player, number) {
    try {
        dispatch({ type: "ROSTER/SET_PLAYER_NUMBER", player, number });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function updatePlayerInjuryStatus(dispatch, player, ni, mng) {
    try {
        dispatch({ type: "ROSTER/SET_PLAYER_INJURY_STATUS", player, mng, ni });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function updatePlayerStats(dispatch, player, stat) {
    try {
        dispatch({ type: "ROSTER/UPDATE_PLAYER_STAT", player, stat });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}

function addItem(dispatch, item) {
    try {
        dispatch({ type: "ROSTER/ADD_ITEM", item });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function removeItem(dispatch, item) {
    try {
        dispatch({ type: "ROSTER/REMOVE_ITEM", item });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}

function addWin(dispatch) {
    try {
        dispatch({ type: "ROSTER/ADD_WIN" });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function addLoss(dispatch) {
    try {
        dispatch({ type: "ROSTER/ADD_LOSS" });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}
function addDraw(dispatch) {
    try {
        dispatch({ type: "ROSTER/ADD_DRAW" });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}

function updateTreasury(dispatch, treasury) {
    try {
        dispatch({ type: "ROSTER/UPDATE_TREASURY", treasury });
    } catch {
        dispatch({ type: "ROSTER/ERROR" });
    }
}

// Business Logic
function rosterValuation(roster) {
    const playerValue = Array.isArray(roster.players)
        ? roster.players.reduce((acc, player) => player.cost + acc, 0)
        : 0;
    const miscValue = Object.keys(roster.items).reduce((acc, key) => {
        const item = roster.items[key];
        return item.qty * item.value + acc;
    }, 0);

    return playerValue + miscValue;
}
function save(leagueMode, roster) {
    if (leagueMode) {
        console.log("saving to server...");
    } else {
        LOCAL.set(roster.uuid, roster);
    }
}

export {
    RosterProvider,
    useRosterState,
    useRosterDispatch,
    initializeRoster,
    setRoster,
    loadRoster,
    setLeagueMode,
    setMaxValue,
    setTeamLabel,
    addPlayer,
    removePlayer,
    updatePlayer,
    setPlayerName,
    setPlayerNumber,
    updatePlayerInjuryStatus,
    updatePlayerStats,
    addWin,
    addLoss,
    addDraw,
    updateTreasury,
    addItem,
    removeItem,
};
