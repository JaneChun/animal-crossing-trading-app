import React from 'react';
import { Link } from 'react-router-dom';

interface NavProps {
	isLoggedIn: boolean;
}

function Nav({ isLoggedIn }: NavProps) {
	return (
		<nav>
			<Link to='/'>Home</Link>
			{isLoggedIn ? <Link to='/mypage'>MyPage</Link> : <Link to='/login'>Login</Link>}
		</nav>
	);
}

export default Nav;
