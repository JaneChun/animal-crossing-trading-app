import { AuthProvider } from '@firebase/auth-types';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../Components/LoginModal';
import { auth, db } from '../fbase';

const Login = () => {
	const navigate = useNavigate();

	const onSocialClick = async (e: React.MouseEvent<HTMLDivElement>) => {
		const { id } = e.target as HTMLDivElement;
		let provider: AuthProvider;
		if (id === 'google') {
			provider = new GoogleAuthProvider();
		} else {
			provider = new FacebookAuthProvider();
		}

		await signInWithPopup(auth, provider)
			.then((result) => {
				const user = result.user;
				localStorage.setItem('uid', user.uid);
				checkUsersData(user.uid);
				navigate('/');
				window.location.reload();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const checkUsersData = async (userUid: string) => {
		const UsersdocRef = doc(db, 'Users', userUid);
		const UsersResponse = await getDoc(UsersdocRef);
		if (!UsersResponse.exists()) {
			await setDoc(UsersdocRef, { islandName: '', rating: 0, count: 0, isDeletedAccount: false });
		}
	};

	// const onGoogleClick = async () => {
	// 	let provider: AuthProvider = new GoogleAuthProvider();
	// 	signInWithPopup(auth, provider)
	// 		.then((result) => {
	// 			const credential = GoogleAuthProvider.credentialFromResult(result);
	// 			const token = credential?.accessToken;
	// 			const user = result.user;
	// 			navigate('/');
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// };

	// const onFacebookClick = async () => {
	// 	let provider: AuthProvider = new FacebookAuthProvider();
	// 	signInWithPopup(auth, provider).then((result) => {
	// 		const credential = FacebookAuthProvider.credentialFromResult(result);
	// 		const token = credential?.accessToken;
	// 		const user = result.user;
	// 		navigate('/');
	// 	});
	// };

	return (
		<div className='custom-container'>
			<LoginModal onSocialClick={onSocialClick} />
		</div>
	);
};

export default Login;
