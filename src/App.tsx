import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Nav from './Components/Nav';
import Home from './Pages/Home';
import Login from './Pages/Login';
import MyPage from './Pages/MyPage';
import { AuthContext } from './context/AuthContext';

function App() {
	const { userInfo } = useContext(AuthContext);
	console.log('user in App', userInfo);

	return (
		<>
			<Header />
			<Outlet />
			<Nav />
		</>
	);
}

export default App;
