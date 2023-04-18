import { Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Nav from './Components/Nav';

const App = () => {
	return (
		<div className='flex h-screen w-screen items-center justify-center'>
			<div className='relative h-screen w-screen shadow-md lg:max-h-[700px] lg:max-w-sm'>
				<Header />
				<Outlet />
				<Nav />
			</div>
		</div>
	);
};

export default App;
