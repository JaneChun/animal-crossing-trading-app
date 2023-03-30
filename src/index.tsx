import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './Router';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<AuthContextProvider>
		<ChatContextProvider>
			<RouterProvider router={router} />
		</ChatContextProvider>
	</AuthContextProvider>
);
