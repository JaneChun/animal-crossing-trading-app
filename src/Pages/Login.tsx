import React from 'react';
import { auth } from '../fbase';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { AuthProvider } from '@firebase/auth-types';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../Components/LoginModal';

function Login() {
	const navigate = useNavigate();

	const onGoogleClick = async () => {
		let provider: AuthProvider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;
				const user = result.user;
				navigate('/');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const onFacebookClick = async () => {
		let provider: AuthProvider = new FacebookAuthProvider();
		signInWithPopup(auth, provider).then((result) => {
			const credential = FacebookAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			const user = result.user;
			navigate('/');
		});
	};

	return (
		<div className='h-screen'>
			<LoginModal onGoogleClick={onGoogleClick} onFacebookClick={onFacebookClick} />
		</div>
	);
}

export default Login;
