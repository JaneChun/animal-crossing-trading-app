import { collection, doc, DocumentData, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../fbase';
import { elapsedTime } from '../Utilities/elapsedTime';

const MyChat = () => {
	const [chatData, setChatData] = useState<DocumentData[]>([]);
	const { userInfo } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
	const navigate = useNavigate();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const q = query(collection(db, 'Chats'), where('participants', 'array-contains', userInfo.uid));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const docObj = {
				...doc.data(),
				id: doc.id,
			};
			setChatData((chatData) => [...chatData, docObj]);
		});
	};

	const handleSelect = (user: any) => {
		dispatch({ type: 'CHANGE_USER', payload: user });
		navigate(`/chat/${user.uid}`);
	};

	return (
		<div className='absolute top-[calc(61px)] h-[calc(100vh-121px)] w-screen overflow-y-auto p-7'>
			<div className='divide-y divide-gray-100 dark:divide-gray-700'>
				<div className='pb-2 text-lg font-bold text-gray-900 dark:text-white'>채팅</div>
				{chatData.length !== 0 &&
					chatData.map((chat) => {
						const { messages, usersInfo } = chat as any;
						const counterpart = usersInfo.find((v: any) => v.uid !== userInfo.uid);
						return (
							<div
								key={chat.id}
								onClick={() => handleSelect(counterpart)}
								className='relative flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700'
							>
								<div className='flex-shrink-0'>
									<img className='h-11 w-11 rounded-full' src={counterpart.photoURL} />
									{/* <div className='absolute ml-6 -mt-5 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-blue-600 dark:border-gray-800'>
							<svg className='h-3 w-3 text-white' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
								<path d='M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z'></path>
								<path d='M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z'></path>
						</svg> 
						</div>*/}
								</div>
								<div className='w-full pl-3'>
									<div className='mb-1.5 flex justify-between text-sm'>
										<span className='font-semibold text-gray-900 dark:text-white'>{counterpart.displayName}</span>
										<span className='text-xs text-blue-600 dark:text-blue-500'>{elapsedTime(messages[messages.length - 1]?.date.toDate())}</span>
									</div>

									<div className='text-xs text-gray-500'>{messages[messages.length - 1]?.text}</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default MyChat;
