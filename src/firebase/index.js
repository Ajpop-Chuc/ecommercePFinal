/**
 * Firebase Data
 * embryo comes with built in firebase database features
 * You Need To Add Your Firsebase App Account Details Here
 */
import firebase from 'firebase/app';
import 'firebase/database';

var firebaseConfig = {
	apiKey: "AIzaSyBXyGS6LdNauzj-nn4ItKNV0tTFSm9lYuI",
	authDomain: "embryo-react-29ecb.firebaseapp.com",
	databaseURL: "https://embryo-react-29ecb.firebaseio.com",
	projectId: "embryo-react-29ecb",
	storageBucket: "embryo-react-29ecb.appspot.com",
	messagingSenderId: "118413959528",
	appId: "1:118413959528:web:2e99d374df424af2e636dd",
	measurementId: "G-K3MWJBBM6T"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);


export default firebase;