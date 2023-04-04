import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { createContext, useEffect, useState } from 'react';
import { auth, db } from '../fbase';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const uid = user.uid;

				// firestore에서 사용자 정보 가져오기
				const userRef = doc(db, 'Users', uid);
				const userDoc = await getDoc(userRef);
				if (userDoc.exists()) {
					const { islandName, rating, count } = userDoc.data();
					setUserInfo({
						// displayName: user.displayName,
						// photoURL: user.photoURL,
						// uid: user.uid,
						...user,
						islandName,
						rating,
						count,
					});
				}
			} else {
				setUserInfo(null);
			}
		});

		return () => {
			unsub();
		};
	}, []);

	return <AuthContext.Provider value={{ userInfo }}>{children}</AuthContext.Provider>;
};
