import React from 'react';
import router from 'next/router';
import { auth } from '../services/fire';
import local from './local';

const withAuth = (Component) => {
	return class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				status: 'LOADING',
				user: null,
			};
		}

		componentDidMount() {
			auth.onAuthStateChanged((authUser) => {
				local.set('user', authUser);
				if (authUser) {
					this.setState({ status: 'SIGNED_IN' });
				} else {
					router.push('/signin');
				}
			});
		}

		renderContent() {
			const { status } = this.state;
			if (status === 'SIGNED_IN') {
				return <Component {...this.props} />;
			}
		}

		render() {
			return <React.Fragment>{this.renderContent()}</React.Fragment>;
		}
	};
};

export default withAuth;
