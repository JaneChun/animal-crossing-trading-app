import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home';
import Login from './Pages/Login';
import MyPage from './Pages/MyPage';
import NewPost from './Pages/NewPost';
import UserPage from './Pages/UserPage';
import Search from './Pages/Search';
import PostDetail from './Pages/PostDetail';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '',
				index: true,
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
				path: '/user/:uid',
				element: <UserPage />,
			},
			{
				path: '/search',
				element: <Search />,
			},
			{
				path: '/post/:id',
				element: <PostDetail />,
			},
		],
	},
]);

export default router;
