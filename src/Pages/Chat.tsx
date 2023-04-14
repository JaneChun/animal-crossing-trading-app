import { uuidv4 } from '@firebase/util';
import { arrayUnion, deleteDoc, doc, DocumentData, increment, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../fbase';

const Chat = () => {
	const { userInfo } = useContext(AuthContext);
	const { data } = useContext(ChatContext);
	const [chatInput, setChatInput] = useState('');
	const [messages, setMessages] = useState<DocumentData[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const modalRef = useRef<HTMLButtonElement | null>(null);
	const navigate = useNavigate();
	const [participants, setParticipants] = useState([]);
	const messageEndRef = useRef<HTMLDivElement | null>(null);
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
	const [rating, setRating] = useState<number>(0);
	const [hover, setHover] = useState<number>(0);

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

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const chatInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setChatInput(e.target.value);
	};

	const onSubmit = async () => {
		if (participants.length === 1 || chatInput === '') return;

		const requestData = {
			messages: arrayUnion({
				id: uuidv4(),
				senderId: userInfo.uid,
				text: chatInput,
				date: Timestamp.now(),
			}),
			lastUpdate: Timestamp.now(),
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

	const onLeaveClick = () => {
		const confirm = window.confirm('정말 나가겠습니까?');
		if (confirm) {
			setIsPopupOpen(true);
		}
	};

	const deleteChat = async () => {
		updateRating();
		setIsPopupOpen(false);
		navigate('/chat');

		if (participants.length === 1) {
			deleteDoc(doc(db, 'Chats', data.chatId));
		} else {
			await updateDoc(doc(db, 'Chats', data.chatId), {
				participants: [data.counterpart.uid],
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
	};

	const updateRating = async () => {
		const counterpartRating = Number(data.counterpart.rating);
		const counterPartCount = Number(data.counterpart.count);
		const docRef = doc(db, 'Users', data.counterpart.uid);
		await updateDoc(docRef, {
			rating: ((counterpartRating * counterPartCount + rating) / (counterPartCount + 1)).toFixed(1),
			count: increment(1),
		});
	};

	return (
		<div onClick={handleOutsideClick} className='custom-container flex flex-col items-end'>
			{/* Conversation */}
			<div className='-mb-6 flex w-full flex-1 grow flex-col justify-between overflow-y-auto'>
				<div className='flex justify-between border-b p-5 sm:items-center'>
					<div className='relative flex w-full items-center'>
						<button onClick={() => navigate('/chat')}>
							<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
								<path
									fill='currentColor'
									d='M9.125 21.1L.7 12.7q-.15-.15-.213-.325T.425 12q0-.2.063-.375T.7 11.3l8.425-8.425q.35-.35.875-.35t.9.375q.375.375.375.875t-.375.875L3.55 12l7.35 7.35q.35.35.35.863t-.375.887q-.375.375-.875.375t-.875-.375Z'
								/>
							</svg>
						</button>

						<img src={data.counterpart.photoURL} alt={`${data.counterpart.displayName} profile`} className='h-10 w-10 rounded-full' />

						<div className='flex w-full items-center justify-between'>
							<div className='flex flex-col leading-tight'>
								<div className='ml-3 flex flex-col'>
									<span className='text-md my-1 font-semibold text-gray-700'>{data.counterpart.displayName}</span>
									<div className='mb-1 flex items-end text-sm text-gray-500'>
										<img
											className='mr-0.5 h-5 w-5'
											alt='island icon'
											src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2FCoconut_Tree_NH_Inv_Icon.png?alt=media&token=cd997010-694e-49b0-9390-483772cdad8a'
										/>
										<span>{data.counterpart.islandName}</span>
									</div>
								</div>
							</div>
							<div className='mr-8'>
								<div className='flex items-center text-sm text-gray-500'>
									<span className='text-yellow-400'>
										<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 26 26'>
											<path
												fill='currentColor'
												d='m12 18.275l-4.15 2.5q-.275.175-.575.15t-.525-.2q-.225-.175-.35-.438t-.05-.587l1.1-4.725L3.775 11.8q-.25-.225-.312-.513t.037-.562q.1-.275.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15q.275 0 .537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45q.1.275.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437q-.225.175-.525.2t-.575-.15l-4.15-2.5Z'
											/>
										</svg>
									</span>
									<span>
										{Number(data.counterpart.rating).toFixed(1)} ({data.counterpart.count})
									</span>
								</div>
							</div>

							{/* Dots Button */}
							<button
								ref={modalRef}
								onClick={handleModal}
								id='dropdownMenuIconButton'
								data-dropdown-toggle='dropdownDots'
								className='absolute top-0 -right-1 inline-flex items-center rounded-lg bg-white p-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 '
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
								className={`${!isModalOpen && 'hidden'} + absolute top-8 right-0 z-10 w-auto divide-y divide-gray-100 rounded-lg bg-white shadow`}
							>
								<ul className='text-sm text-gray-700'>
									<li>
										<button onClick={onLeaveClick} className='block w-full px-6 py-2 text-center hover:bg-gray-100 '>
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
							<div key={message.id} className='py-3 text-center text-sm text-gray-400'>
								{message.text}
							</div>
						) : message.senderId === userInfo.uid ? (
							<div key={message.id} className='chat-message'>
								<div className='flex items-end justify-end'>
									<div className='order-1 flex max-w-xs flex-col items-end space-y-2 text-xs'>
										<div>
											<span className='mr-2 text-xs text-gray-400'>{message.date.toDate().toLocaleTimeString().slice(0, -3)}</span>
											<span className='inline-block rounded-lg rounded-br-none bg-mint px-4 py-2 text-white '>{message.text}</span>
										</div>
									</div>
									{/* <img src={userInfo.photoURL} alt={`${userInfo.displayName}'s profile image`} className='order-2 h-10 w-10 rounded-full' /> */}
								</div>
							</div>
						) : (
							<div key={message.id} className='chat-message'>
								<div className='flex items-end'>
									<div className='order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs'>
										<div>
											<span className='inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600'>{message.text}</span>
											<span className='ml-2 text-xs text-gray-400'>{message.date.toDate().toLocaleTimeString().slice(0, -3)}</span>
										</div>
									</div>
									<img src={data.counterpart.photoURL} alt={`${data.counterpart.displayName}'s profile`} className='order-1 h-10 w-10 rounded-full' />
								</div>
							</div>
						)
					)}
					<div ref={messageEndRef}></div>
				</div>
			</div>
			{/* Conversation */}

			{/* Chat Input */}
			<div className='w-full'>
				<label htmlFor='chat' className='sr-only'>
					Your message
				</label>
				<div className='flex items-center bg-gray-50 px-3 py-2'>
					<textarea
						disabled={participants.length === 1 ? true : false}
						id='chat'
						value={chatInput}
						onChange={chatInputHandler}
						rows={1}
						className='block w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-ring-mint'
						placeholder={participants.length === 1 ? '대화 상대가 없습니다.' : '메세지를 입력하세요.'}
					></textarea>
					<button
						type='submit'
						onClick={onSubmit}
						className={`${
							participants.length === 1 ? 'text-gray-500' : 'text-mint hover:bg-[#0cc6b635]'
						} inline-flex cursor-pointer justify-center rounded-full p-2 `}
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

			{/* Rating PopUp */}
			{isPopupOpen && (
				<div id='popup-modal' className='absolute top-1/3 left-0 right-0 z-50'>
					<div className='m-5 rounded-lg bg-white shadow'>
						<div className='p-6 text-center'>
							<h3 className='text-md mb-2 font-normal text-gray-500'>상대방의 매너 점수는 어떤가요?</h3>

							<div>
								<ul className='mb-5 flex justify-center'>
									{[...Array(5)].map((star, i) => {
										const ratingValue = i + 1;

										return (
											<label>
												<input className='hidden' onMouseOut={() => setHover(0)} type='radio' name='rating' value={ratingValue} />
												<FaStar
													onClick={() => setRating(ratingValue)}
													onMouseEnter={() => setHover(ratingValue)}
													className={`${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'} + cursor-pointer`}
												/>
											</label>
										);
									})}
								</ul>
							</div>

							<button
								onClick={deleteChat}
								data-modal-hide='popup-modal'
								type='button'
								className='mr-2 inline-flex items-center rounded-lg bg-mint px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-hover-mint focus:outline-none focus:ring-4 focus:ring-ring-mint'
							>
								확인
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Rating PopUp */}
		</div>
	);
};

export default Chat;
