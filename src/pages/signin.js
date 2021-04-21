import Head from 'next/head';
import Router from 'next/router';
import { auth } from '../services/fire';

import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import {
	Avatar,
	Button,
	Link,
	Grid,
	Typography,
	Container,
	CssBaseline,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const SignIn = () => {
	const classes = useStyles();

	const handleSignIn = (formData) => {
		const { email, password } = formData;
		auth
			.signInWithEmailAndPassword(email, password)
			.then(() => {
				Router.push('/');
			})
			.catch((ex) => {
				alert(ex.message);
				console.log(ex);
			});
	};

	return (
		<>
			<Head>
				<title>Sign-In</title>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/logo-96x96.png" />
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign In
					</Typography>
					<Form
						onSubmit={handleSignIn}
						render={({ handleSubmit }) => (
							<form onSubmit={handleSubmit} name="signin">
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Sign In
								</Button>
								<Grid container>
									<Grid item xs>
										<Link href="#" variant="body2">
											Forgot password?
										</Link>
									</Grid>
									<Grid item>
										<Link href="/signup" variant="body2">
											{"Don't have an account? Sign Up"}
										</Link>
									</Grid>
								</Grid>
							</form>
						)}
					/>
				</div>
			</Container>
		</>
	);
};

export default SignIn;
