import { AuthProvider } from '@firebase/auth-types';
import { FirebaseError } from 'firebase/app';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorToast from '../Components/ErrorToast';
import LoginModal from '../Components/LoginModal';
import { setDataToFirestore } from '../Utilities/firebaseApi';
import { auth, db } from '../fbase';

const Login = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (state) {
			setError(state.error);
		}
	}, [state]);

	const onSocialClick = async (e: React.MouseEvent<HTMLDivElement>) => {
		const { id } = e.target as HTMLDivElement;
		let provider: AuthProvider;
		if (id === 'google') {
			provider = new GoogleAuthProvider();
		} else {
			provider = new FacebookAuthProvider();
		}

		try {
			const response = await signInWithPopup(auth, provider);
			const user = response.user;
			localStorage.setItem('uid', user.uid);
			checkUsersData(user.uid).then(() => {
				navigate('/');
				window.location.reload();
			});
		} catch (error: unknown) {
			const { code } = error as FirebaseError;
			if (code === 'auth/popup-closed-by-user') {
				setError('로그인 중 팝업 창이 종료되어 로그인에 실패했습니다.');
			}
		}
	};

	const checkUsersData = async (userUid: string) => {
		const usersDocRef = doc(db, 'Users', userUid);
		const usersResponse = await getDoc(usersDocRef);
		if (!usersResponse.exists()) {
			const requestData = {
				islandName: '',
				rating: 0,
				count: 0,
				isDeletedAccount: false,
			};
			await setDataToFirestore(usersDocRef, requestData);
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
			{error && <ErrorToast error={error} setError={setError} />}
			<LoginModal onSocialClick={onSocialClick} />
		</div>
	);
};

export default Login;
