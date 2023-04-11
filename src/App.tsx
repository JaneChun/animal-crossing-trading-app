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
		<div className='flex h-screen w-screen items-center justify-center'>
			<div className='relative h-screen w-screen shadow-md lg:max-h-[700px] lg:max-w-sm'>
				<Header />
				<Outlet />
				<Nav />
			</div>
		</div>
	);
}

export default App;
