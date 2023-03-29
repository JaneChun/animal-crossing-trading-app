import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { auth } from './fbase';
import Header from './Components/Header';
import Nav from './Pages/Nav';
import Home from './Pages/Home';
import Login from './Pages/Login';
import MyPage from './Pages/MyPage';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
		});
	}, []);

	return (
		<>
			<Header />
			<Outlet />
			<Nav isLoggedIn={isLoggedIn} />
		</>
	);
}

export default App;
