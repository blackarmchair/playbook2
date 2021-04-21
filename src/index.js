import React from 'react';
import ReactDOM from 'react-dom';
// import * as serviceWorker from "./serviceWorkerRegistration";
import { ThemeProvider } from '@material-ui/core';

import App from './App';
import theme from './theme';
import { TeamProvider } from './contexts/team';
import { RosterProvider } from './contexts/roster';

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<TeamProvider>
				<RosterProvider>
					<App />
				</RosterProvider>
			</TeamProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// serviceWorker.register();
