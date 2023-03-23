import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home';
import Login from './Pages/Login';
import MyPage from './Pages/MyPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '',
				element: <Home />,
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'mypage',
				element: <MyPage />,
			},
		],
	},
]);

export default router;
