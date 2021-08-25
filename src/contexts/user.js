import * as React from 'react';
import { database } from '../services/fire';
import LOCAL from '../helpers/local';

// Contexts
const initialState = {
	fname: '',
	lname: '',
	email: '',
	userList: [],
};
const UserStateContext = React.createContext(initialState);
const UserDispatchContext = React.createContext(initialState);

// Lifecycle Transactors
function userReducer(state, action) {
	switch (action.type) {
		case 'USER/SET_USER_DATA': {
			return {
				...state,
				fname: action.fname,
				lname: action.lname,
				email: action.email,
			};
		}
		case 'USER/SET_USER_LIST': {
			return {
				...state,
				userList: action.userList,
			};
		}
		default:
			return state;
	}
}
function UserProvider({ children }) {
	const [state, dispatch] = React.useReducer(userReducer, {
		...initialState,
	});
	return (
		<UserStateContext.Provider value={state}>
			<UserDispatchContext.Provider value={dispatch}>
				{children}
			</UserDispatchContext.Provider>
		</UserStateContext.Provider>
	);
}
function useUserState() {
	const ctx = React.useContext(UserStateContext);
	if (ctx === undefined) {
		throw new Error('useUserState must be used within a UserProvider');
	}
	return ctx;
}
function useUserDispatch() {
	const ctx = React.useContext(UserDispatchContext);
	if (ctx === undefined) {
		throw new Error('useUserDispatch must be used within a UserProvider');
	}
	return ctx;
}

// Actions
async function getUserData(dispatch, userId) {
	try {
		const usersSnapshot = await database.collection('users').get();
		const user = usersSnapshot.docs
			.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.find((doc) => doc.id === userId);
		dispatch({
			type: 'USER/SET_USER_DATA',
			user,
		});
		return user;
	} catch (e) {
		dispatch({ type: 'USER/SET_USER_DATA', initialState });
	}
}

const getUserList = async (dispatch) => {
	try {
		let users = LOCAL.read('users') || [];

		if (Array.isArray(users) && users.length) {
			const updatedUsersSnapshot = await database
				.collection('users')
				.where(
					'email',
					'not-in',
					users.map((u) => u.email)
				)
				.get();
			const updatedUsersList = updatedUsersSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			users = [...users, ...updatedUsersList];
		} else {
			const userListSnapshot = await database.collection('users').get();
			users = userListSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
		}

		LOCAL.set('users', users);

		dispatch({
			type: 'USER/SET_USER_LIST',
			users,
		});
		return users;
	} catch (e) {
		dispatch({
			type: 'USER/SET_USER_LIST',
			userList: initialState.userList,
		});
	}
};

export {
	userReducer,
	UserProvider,
	useUserState,
	useUserDispatch,
	getUserData,
	getUserList,
};
