import { arrayUnion, doc, DocumentData, getDocs, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../fbase';
import { uuidv4 } from '@firebase/util';

const Chat = () => {
	const { userInfo } = useContext(AuthContext);
	const { data } = useContext(ChatContext);
	const [chatInput, setChatInput] = useState('');
	const [messages, setMessages] = useState<DocumentData[]>([]);

	useEffect(() => {
		console.log('useEffect 실행');
		console.log('chatId', data.chatId);
		const unsub = onSnapshot(doc(db, 'Chats', data.chatId), (doc: DocumentData) => {
			doc.exists() && setMessages(doc.data().messages);

			return () => {
				unsub();
			};
		});
	}, [data.chatId]);

	const chatInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setChatInput(e.target.value);
	};

	const onSubmit = async () => {
		const requestData = {
			messages: arrayUnion({
				id: uuidv4(),
				senderId: userInfo.uid,
				text: chatInput,
				date: Timestamp.now(),
			}),
		};

		try {
			// 둘의 채팅방에 추가
			await updateDoc(doc(db, 'Chats', data.chatId), requestData);

			// 나의 채팅방에 추가
			await updateDoc(doc(db, 'UserChats', userInfo.uid), {
				[data.chatId + '.id']: uuidv4(),
				[data.chatId + '.lastMessage']: {
					text: chatInput,
					id: uuidv4(),
				},
				[data.chatId + '.date']: serverTimestamp(),
			});

			// 상대의 채팅방에 추가
			await updateDoc(doc(db, 'UserChats', data.user.uid), {
				[data.chatId + '.id']: uuidv4(),
				[data.chatId + '.lastMessage']: {
					text: chatInput,
				},
				[data.chatId + '.date']: serverTimestamp(),
			});
		} catch (error) {
			console.log(error);
		} finally {
			setChatInput('');
		}
	};
	console.log('context data', data);
	console.log('messages', messages);
	return (
		<div className='absolute top-[calc(61px)] flex h-[calc(100vh-121px)] w-screen flex-col items-end'>
			{/* Conversation */}
			<div className='flex w-full flex-1 grow flex-col justify-between overflow-y-auto sm:p-6'>
				<div className='border-b-1 flex justify-between border p-5 sm:items-center'>
					<div className='relative flex w-full items-center space-x-4'>
						<img src={data.user.photoURL} className='h-10 w-10 rounded-full' />

						<div className='flex w-full items-center justify-between'>
							<div className='flex flex-col leading-tight'>
								<span className='text-md mt-1  mr-3 mb-1 font-semibold text-gray-700'>{data.user.displayName}</span>
								{/* <span className='text-sm text-gray-600'>🏝 {state.creatorDisplayName.split(' ')[1]}</span> */}
							</div>
							<div>평점</div>
						</div>
					</div>
				</div>

				<div id='messages' className='flex flex-col space-y-5 overflow-y-auto p-5'>
					{messages.map((message) =>
						message.senderId === userInfo.uid ? (
							<div key={message.id} className='chat-message'>
								<div className='flex items-end justify-end'>
									<div className='order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs'>
										<div>
											<span className='inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white '>{message.text}</span>
										</div>
									</div>
									<img src={userInfo.photoURL} alt={`${userInfo.displayName}'s profile image`} className='order-2 h-10 w-10 rounded-full' />
								</div>
							</div>
						) : (
							<div key={message.id} className='chat-message'>
								<div className='flex items-end'>
									<div className='order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs'>
										<div>
											<span className='inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600'>{message.text}</span>
										</div>
									</div>
									<img src={data.user.photoURL} alt={`${data.user.displayName}'s profile image`} className='order-1 h-10 w-10 rounded-full' />
								</div>
							</div>
						)
					)}
				</div>
			</div>
			{/* Conversation */}

			{/* Chat Input */}
			<div className='w-full'>
				<label htmlFor='chat' className='sr-only'>
					Your message
				</label>
				<div className='flex items-center bg-gray-50 px-3 py-2 dark:bg-gray-700'>
					<textarea
						id='chat'
						value={chatInput}
						onChange={chatInputHandler}
						rows={1}
						className='block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						placeholder='메세지를 입력하세요.'
					></textarea>
					<button
						type='submit'
						onClick={onSubmit}
						className='inline-flex cursor-pointer justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600'
					>
						<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
							<g fill='none'>
								<path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z' />
								<path
									fill='currentColor'
									d='m21.433 4.861l-6 15.5a1 1 0 0 1-1.624.362l-3.382-3.235l-2.074 2.073a.5.5 0 0 1-.853-.354v-4.519L2.309 9.723a1 1 0 0 1 .442-1.691l17.5-4.5a1 1 0 0 1 1.181 1.329ZM19 6.001L8.032 13.152l1.735 1.66L19 6Z'
								/>
							</g>
						</svg>
						<span className='sr-only'>Send message</span>
					</button>
				</div>
			</div>
			{/* Chat Input */}
		</div>
	);
};

export default Chat;
