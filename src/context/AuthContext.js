import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../fbase';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			setUserInfo(user);
		});

		return () => {
			unsub();
		};
	}, []);

	return <AuthContext.Provider value={{ userInfo }}>{children}</AuthContext.Provider>;
};
