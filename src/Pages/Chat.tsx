import {
	arrayUnion,
	deleteDoc,
	deleteField,
	doc,
	DocumentData,
	getDocs,
	onSnapshot,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../fbase';
import { uuidv4 } from '@firebase/util';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
	const { userInfo } = useContext(AuthContext);
	const { data } = useContext(ChatContext);
	const [chatInput, setChatInput] = useState('');
	const [messages, setMessages] = useState<DocumentData[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const modalRef = useRef<HTMLButtonElement | null>(null);
	const navigate = useNavigate();
	const [participants, setParticipants] = useState([]);

	useEffect(() => {
		const unsub = onSnapshot(doc(db, 'Chats', data.chatId), (doc: DocumentData) => {
			if (doc.exists()) {
				setMessages(doc.data().messages);
				setParticipants(doc.data().participants);
			}

			return () => {
				unsub();
			};
		});
	}, [data.chatId]);

	const chatInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setChatInput(e.target.value);
	};

	const onSubmit = async () => {
		if (participants.length === 1) return;

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
		} catch (error) {
			console.log(error);
		} finally {
			setChatInput('');
		}
	};

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as any;
		if (isModalOpen && !modalRef.current?.contains(target)) {
			setIsModalOpen(false);
		}
	};

	const deleteChat = async () => {
		// UserChats 컬렉션에서 내 id 도큐멘트에 상대 이름의 필드 삭제
		const confirm = window.confirm('정말로 나가겠습니까?');

		if (confirm) {
			if (participants.length === 1) {
				deleteDoc(doc(db, 'Chats', data.chatId));
			} else {
				await updateDoc(doc(db, 'Chats', data.chatId), {
					participants: [data.user.uid],
				});

				await updateDoc(doc(db, 'Chats', data.chatId), {
					messages: arrayUnion({
						id: uuidv4(),
						senderId: 'system',
						text: `${userInfo.displayName}님이 나가셨습니다.`,
						date: Timestamp.now(),
					}),
				});
			}

			navigate('/chat');
		}
	};
	console.log('messages in Chat', messages);
	console.log('p', participants);
	return (
		<div onClick={handleOutsideClick} className='absolute top-[calc(61px)] flex h-[calc(100vh-121px)] w-screen flex-col items-end'>
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
							<div className='mr-10'>평점</div>

							{/* Dots Button */}
							<button
								ref={modalRef}
								onClick={handleModal}
								id='dropdownMenuIconButton'
								data-dropdown-toggle='dropdownDots'
								className='absolute top-0 right-0 inline-flex items-center rounded-lg bg-white p-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600'
								type='button'
							>
								<svg className='h-5 w-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
									<path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z'></path>
								</svg>
							</button>
							{/* Dots Button */}

							{/* Dropdown */}
							<div
								id='dropdownDots'
								className={`${
									!isModalOpen && 'hidden'
								} + absolute top-8 right-0 z-10 w-auto divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700`}
							>
								<ul className='text-sm text-gray-700 dark:text-gray-200'>
									<li>
										<button
											onClick={() => deleteChat()}
											className='block w-full px-6 py-2 text-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
										>
											나가기
										</button>
									</li>
								</ul>
							</div>
							{/* Dropdown */}
						</div>
					</div>
				</div>

				<div id='messages' className='flex flex-col space-y-5 overflow-y-auto p-5'>
					{messages.map((message) =>
						message.senderId === 'system' ? (
							<div>{message.text}</div>
						) : message.senderId === userInfo.uid ? (
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
						disabled={participants.length === 1 ? true : false}
						id='chat'
						value={chatInput}
						onChange={chatInputHandler}
						rows={1}
						className='block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						placeholder={participants.length === 1 ? '대화 상대가 없습니다.' : '메세지를 입력하세요.'}
					></textarea>
					<button
						type='submit'
						onClick={onSubmit}
						className={`${
							participants.length === 1 ? 'text-gray-500' : 'text-blue-600 hover:bg-blue-100'
						} inline-flex cursor-pointer justify-center rounded-full p-2  dark:text-blue-500 dark:hover:bg-gray-600`}
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
