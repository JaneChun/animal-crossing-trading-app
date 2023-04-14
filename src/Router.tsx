import { createHashRouter } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home';
import Login from './Pages/Login';
import MyPage from './Pages/MyPage';
import NewPost from './Pages/NewPost';
import Search from './Pages/Search';
import PostDetail from './Pages/PostDetail';
import PostEdit from './Components/PostDetail/PostEdit';
import Chat from './Pages/Chat';
import MyChat from './Pages/MyChat';

const router = createHashRouter(
	[
		{
			path: '/',
			element: <App />,
			children: [
				{
					path: '/',
					index: true,
					element: <Home />,
				},
				{
					path: '/login',
					element: <Login />,
				},
				{
					path: '/mypage',
					element: <MyPage />,
				},
				{
					path: '/newpost',
					element: <NewPost />,
				},
				{
					path: '/search',
					element: <Search />,
				},
				{
					path: '/post/:id',
					element: <PostDetail />,
				},
				{
					path: '/post-edit/:id',
					element: <PostEdit />,
				},
				{
					path: '/chat',
					element: <MyChat />,
				},
				{
					path: '/chat/:id',
					element: <Chat />,
				},
			],
		},
	],
	{
		basename: '/',
	}
);

export default router;
