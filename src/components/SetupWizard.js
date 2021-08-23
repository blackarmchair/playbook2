import React from 'react';
import { useRouter } from 'next/router';
import {
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	TextField,
	Menu,
	MenuItem,
	Typography,
	FormControlLabel,
	Switch,
	makeStyles,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useTeamState } from '../contexts/team';
import {
	useRosterState,
	useRosterDispatch,
	setRoster,
	setMaxValue,
	setTeamLabel,
	setLeagueMode,
	initializeRoster,
} from '../contexts/roster';
import * as Formatters from '../helpers/formatters';
import * as Sorters from '../helpers/sorters';

const useStyles = makeStyles((theme) => ({
	root: { width: '100%' },
	actionsContainer: { marginBottom: theme.spacing(2) },
	headline: {
		display: 'flex',
		alignItems: 'center',
	},
	description: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(3),
	},
	button: {
		marginTop: theme.spacing(3),
		marginRight: theme.spacing(1),
	},
}));

const SetupWizard = () => {
	const classes = useStyles();
	const router = useRouter();

	// Team Data
	const { teams } = useTeamState();

	// Roster Data
	const { teamName, uuid } = useRosterState();
	const dispatch = useRosterDispatch();
	const handleSetRoster = (team) => {
		handleClose();
		setRoster(dispatch, team);
	};
	const handleSetMaxValue = (event) => {
		const value = parseInt(event.target.value.replace(/,/g, ''));
		setMaxValue(dispatch, value);
	};
	const handleSetTeamLavel = (event) => {
		setTeamLabel(dispatch, event.target.value);
	};

	// League Mode
	const [leagueMode, setLeagueModeChecked] = React.useState(true);
	const toggleLeagueMode = () => {
		setLeagueMode(dispatch, !leagueMode);
		setLeagueModeChecked(!leagueMode);
	};

	// Handle Stepper State
	const [activeStep, setActiveStep] = React.useState(0);
	const handleNext = (finalStep) => {
		if (!finalStep) {
			setActiveStep((prev) => prev + 1);
		} else {
			initializeRoster(dispatch);
			router.push(`/roster/${uuid}`);
		}
	};
	const handleBack = () => {
		setActiveStep((prev) => prev - 1);
	};

	// Handle Team Selection Menu
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// Subcomponents
	const steps = [
		{
			label: 'Select Your Faction',
			description: 'Select which faction you will use to build your roster.',
			content: () => (
				<Button variant="text" onClick={handleClick}>
					{teamName ? (
						<span className={classes.headline}>
							{teamName} <KeyboardArrowDownIcon />
						</span>
					) : (
						<span className={classes.headline}>
							Select a Team <KeyboardArrowDownIcon />
						</span>
					)}
				</Button>
			),
		},
		{
			label: 'Select Your Team Value',
			description: 'Define the maximum value for your roster.',
			content: () => (
				<TextField
					onChange={(event) => handleSetMaxValue(event)}
					label="Team Value(g)"
					variant="outlined"
					defaultValue={Formatters.parseNumber(1000000)}
					disabled
				/>
			),
		},
		{
			label: 'Tournament / League Settings',
			description:
				'Define special rules in-place for your tournament / league.',
			content: () => (
				<>
					<TextField
						onChange={(event) => handleSetTeamLavel(event)}
						label="Team Name"
						variant="outlined"
						defaultValue="The No-Name Fools"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={leagueMode}
								onChange={toggleLeagueMode}
								name="leagueMode"
								color="primary"
								disabled
							/>
						}
						label="League Mode"
					/>
				</>
			),
		},
	];
	const StepperNav = ({ finalStep = false }) => {
		return (
			<div className={classes.actionsContainer}>
				<div>
					<Button
						disabled={activeStep === 0}
						onClick={handleBack}
						className={classes.button}
					>
						Back
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleNext(finalStep)}
						className={classes.button}
					>
						{finalStep ? 'Finish' : 'Next'}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<div className={classes.root}>
			<Menu
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{Sorters.alphaSort(teams, 'name').map((team) => (
					<MenuItem key={team.id} onClick={() => handleSetRoster(team)}>
						{team.name}
					</MenuItem>
				))}
			</Menu>
			<Stepper activeStep={activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<StepLabel>{step.label}</StepLabel>
						<StepContent>
							<Typography className={classes.description}>
								{step.description}
							</Typography>
							{step.content()}
							<StepperNav finalStep={index + 1 === steps.length} />
						</StepContent>
					</Step>
				))}
			</Stepper>
		</div>
	);
};

export default SetupWizard;
