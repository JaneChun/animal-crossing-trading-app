import { collection, DocumentData, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { db } from '../fbase';
import { elapsedTime } from '../Utilities/elapsedTime';

const MyChat = () => {
	const [chatData, setChatData] = useState<DocumentData[]>([]);
	const { userInfo } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
	const uid = localStorage.getItem('uid');
	const navigate = useNavigate();

	useEffect(() => {
		if (uid) {
			getData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getData = async () => {
		const q = query(collection(db, 'Chats'), where('participants', 'array-contains', uid), orderBy('lastUpdate', 'desc'));
		await onSnapshot(q, (querySnapshot) => {
			let temp: DocumentData[] = [];
			querySnapshot.forEach((doc) => {
				const docObj = {
					...doc.data(),
					id: doc.id,
				};
				temp = [...temp, docObj];
			});
			setChatData(temp);
		});
	};

	const handleSelect = (counterpart: any) => {
		dispatch({ type: 'CHANGE_USER', payload: counterpart });
		navigate(`/chat/${counterpart.uid}`);
	};

	return (
		<div className='custom-container p-5'>
			<div className='pb-2 text-lg font-bold text-gray-900 '>채팅</div>
			{chatData.length === 0 ? (
				<div className='flex h-full w-full items-center justify-center'>
					<span className='text-sm text-gray-500'>참여 중인 채팅방이 없습니다.</span>
				</div>
			) : (
				chatData.map((chat) => {
					const { messages, usersInfo } = chat as any;
					const counterpart = usersInfo.find((v: any) => v.uid !== userInfo.uid);
					return (
						<div
							key={chat.id}
							onClick={() => handleSelect(counterpart)}
							className='relative flex max-h-16 max-w-full border-b border-gray-100 px-4 py-3 hover:bg-gray-100 '
						>
							<img className='h-11 w-11 rounded-full' alt={`${counterpart.displayName} profile`} src={counterpart.photoURL} />
							<div className='w-32 grow pl-3'>
								<div className='mb-1.5 flex  justify-between text-sm'>
									<span className='font-semibold text-gray-900 '>{counterpart.displayName}</span>
									<span className='text-xs text-hover-mint'>{elapsedTime(messages[messages.length - 1]?.date.toDate())}</span>
								</div>
								<div className='truncate whitespace-nowrap text-xs text-gray-500'>{messages[messages.length - 1]?.text}</div>
							</div>
						</div>
					);
				})
			)}
		</div>
	);
};

export default MyChat;
