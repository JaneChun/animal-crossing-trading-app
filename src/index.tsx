import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './Context/AuthContext';
import { ChatContextProvider } from './Context/ChatContext';
import './index.css';
import router from './Router';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<AuthContextProvider>
		<ChatContextProvider>
			<RouterProvider router={router} />
		</ChatContextProvider>
	</AuthContextProvider>
);
