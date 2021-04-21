import firebase from 'firebase';

const config = {
	apiKey: 'AIzaSyAarNxo3DgdRBcGmXCqBkZCH59v20OOgnQ',
	authDomain: 'playbook-2061c.firebaseapp.com',
	databaseURL: 'https://playbook-2061c.firebaseio.com',
	projectId: 'playbook-2061c',
	storageBucket: 'playbook-2061c.appspot.com',
	messagingSenderId: '52368741283',
	appId: '1:52368741283:web:e002de09d875bd48df4016',
};
if (!firebase.apps.length) {
	firebase.initializeApp(config);
} else {
	firebase.app();
}

export const database = firebase.firestore();
export const auth = firebase.auth();

export default firebase;
