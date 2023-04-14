import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
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
