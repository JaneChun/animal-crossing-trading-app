import { collection, DocumentData, onSnapshot, query, doc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../fbase';

const MyChat = () => {
	const [data, setData] = useState<DocumentData[]>([]);
	const { userInfo } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
	const navigate = useNavigate();

	useEffect(() => {
		const getData = () => {
			const unsub = onSnapshot(doc(db, 'UserChats', userInfo.uid), (doc: DocumentData) => {
				setData(Object.entries(doc.data()));
			});

			return () => {
				unsub();
			};
		};

		userInfo.uid && getData();
	}, [userInfo.uid]);

	console.log('chatdata', data);

	const handleSelect = (user: any) => {
		console.log('상대 정보', user);
		dispatch({ type: 'CHANGE_USER', payload: user });
		navigate(`/chat/${user.uid}`);
	};

	return (
		<div className='absolute top-[calc(61px)] h-[calc(100vh-121px)] w-screen overflow-y-auto p-5'>
			<ul>
				{data?.map((chat) => (
					<div key={chat[0]}>
						{/* <img /> */}
						<div onClick={() => handleSelect(chat[1].userInfo)}>
							<span>{chat[1].userInfo.displayName}</span>
							<span>{chat[1].userInfo.uid}</span>
							<img src={chat[1].userInfo.photoURL} />
							<p>{chat[1].lastMessage?.text}</p>
						</div>
					</div>
				))}
			</ul>
		</div>
	);
};

export default MyChat;
