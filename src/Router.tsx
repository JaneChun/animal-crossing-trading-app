import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home';
import Login from './Pages/Login';
import MyPage from './Pages/MyPage';
import NewPost from './Pages/NewPost';
import UserPage from './Pages/UserPage';

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
			{
				path: 'newpost',
				element: <NewPost />,
			},
			{
				path: 'user/:uid',
				element: <UserPage />,
			},
		],
	},
]);

export default router;
