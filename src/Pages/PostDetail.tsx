import { collection, deleteDoc, doc, DocumentData, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Comment from '../Components/PostDetail/Comment';
import { AuthContext } from '../context/AuthContext';
import { db } from '../fbase';
import { elapsedTime } from '../Utilities/elapsedTime';
import { cartItem } from './NewPost';

const PostDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState<DocumentData>({});
	const [comments, setComments] = useState<DocumentData[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const modalRef = useRef<HTMLButtonElement | null>(null);
	const { userInfo } = useContext(AuthContext);

	useEffect(() => {
		getData();
		getComments();
	}, []);

	const getData = async () => {
		if (!id) return;

		const docRef = doc(db, 'Boards', id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const docData = docSnap.data();
			setData({ ...docData, id });
		} else {
			console.log('no such document!');
		}
	};

	const getComments = async () => {
		if (!id) return;

		// const q = query(collection(db, 'Boards', id, 'Comments'), orderBy('createdAt', 'desc'));
		const q = query(collection(db, `Boards/${id}/Comments`), orderBy('createdAt', 'asc'));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const docObj = {
				...doc.data(),
				commentId: doc.id,
			};
			setComments((comments) => [...comments, docObj]);
		});
	};

	const editPost = () => {
		if (data.done) return;

		navigate(`/post-edit/${id}`, {
			state: {
				id,
			},
		});
	};

	const deletePost = async () => {
		const confirm = window.confirm('정말로 삭제하겠습니까?');

		if (confirm) {
			const docRef = doc(db, 'Boards', data.id);
			try {
				await deleteDoc(docRef);
				// if (사진이 있다면) {
				// 	const desertRef = ref(storage, 사진)
				// 	await deleteObject(desertRef);
				// }
				navigate('/');
			} catch (error) {
				console.log(error);
			}
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

	const closePost = async () => {
		if (!userInfo || !id || data.done) return;

		const confirm = window.confirm('거래 완료로 변경하겠습니까?');

		if (confirm) {
			try {
				const docRef = doc(db, 'Boards', id);
				await updateDoc(docRef, {
					done: true,
				});
				getData();
			} catch (error) {
				console.log(error);
			}
		}
	};
	console.log('data', data);
	return (
		<div onClick={handleOutsideClick} className='custom-container p-5'>
			{data && (
				<div className='relative mx-2'>
					{/* Type */}
					<div>
						{data.done === true ? (
							<span className='-ml-1 rounded-md border border-gray-200 bg-white py-1 px-2 text-sm font-medium text-gray-800'>거래 완료</span>
						) : data.type === 'sell' ? (
							<span className='-ml-1 rounded-md border border-skyblue bg-skyblue py-1 px-2 text-sm font-medium text-dark-skyblue'>팔아요</span>
						) : (
							<span className='-ml-1 rounded-md border border-lightgreen bg-lightgreen px-2 py-1 text-sm font-medium text-dark-lightgreen'>
								구해요
							</span>
						)}
					</div>
					{/* Type */}

					{data.creatorId === userInfo?.uid && (
						<>
							{/* Dots Button */}
							<button
								ref={modalRef}
								onClick={handleModal}
								id='dropdownMenuIconButton'
								data-dropdown-toggle='dropdownDots'
								className='absolute top-0 right-0 inline-flex items-center rounded-lg bg-white p-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50'
								type='button'
							>
								<svg className='h-6 w-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
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
									{!data.done && (
										<li>
											<button onClick={editPost} className='block w-full px-6 py-2 text-center hover:bg-gray-100'>
												수정
											</button>
										</li>
									)}
									<li>
										<button onClick={deletePost} className='block w-full px-6 py-2 text-center hover:bg-gray-100'>
											삭제
										</button>
									</li>
									{!data.done && (
										<li>
											<button onClick={closePost} className='block w-full px-6 py-2 text-center hover:bg-gray-100'>
												거래 완료
											</button>
										</li>
									)}
								</ul>
							</div>
							{/* Dropdown */}
						</>
					)}

					{/* Text Data */}
					<div className='mt-3 mb-1 text-xl font-semibold text-gray-900'>{data.title}</div>
					<div className='border-b border-gray-200 pb-3'>
						<div className='mb-1 flex items-center justify-between'>
							<div className='flex'>
								<span className='text-md mr-2 font-semibold text-gray-500'>{data.creatorDisplayName}</span>
								<span className='flex items-center text-sm text-gray-500'>
									<img
										className='mr-0.5 h-5 w-5'
										alt='island icon'
										src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2FCoconut_Tree_NH_Inv_Icon.png?alt=media&token=cd997010-694e-49b0-9390-483772cdad8a'
									/>
									<span>{data.creatorIslandName}</span>
								</span>
							</div>

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
									{Number(data.creatorRating).toFixed(1)} ({data.creatorCount})
								</span>
							</div>
						</div>
						<div className='text-xs text-gray-500'>{elapsedTime(data.createdAt?.toDate())}</div>
					</div>
					<div className='mt-4 mb-4 whitespace-pre-wrap p-3 text-base font-normal text-gray-500'>{data.body}</div>
					{/* Text Data */}

					{/* Item List */}
					<ul className='h-auto overflow-y-auto py-2 text-gray-700 dark:text-gray-200' aria-labelledby='dropdownUsersButton'>
						{data.cart?.map((item: cartItem) => (
							<li className='mb-2 rounded-md bg-lightgray' key={item.UniqueEntryID}>
								<div className='flex justify-between px-4 py-2'>
									<div className='flex items-center'>
										<img className='mr-2 h-6 w-6 rounded-md' src={item.imageUrl} alt={item.name} />
										<span className='mr-2 text-base font-semibold'>{item.name}</span>
										<span className='text-sm font-normal text-gray-400'>{item.color && item.color}</span>
									</div>

									<div className='flex items-center'>
										<span className='whitespace-nowrap text-xs'>{item.quantity}개</span>
										<span className='ml-1.5'>
											<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 32 32'>
												<path
													fill='currentColor'
													d='M7.223 2.893a3.072 3.072 0 0 0-4.33 0a3.084 3.084 0 0 0 0 4.34l8.747 8.744l-8.737 8.745a3.072 3.072 0 0 0 0 4.33a3.072 3.072 0 0 0 4.33 0l8.74-8.744l8.74 8.735a3.072 3.072 0 0 0 4.33 0a3.072 3.072 0 0 0 0-4.33l-8.738-8.739l8.747-8.752a3.072 3.072 0 0 0 0-4.33c-1.2-1.19-3.15-1.19-4.34 0l-8.74 8.75l-8.75-8.75Z'
												/>
											</svg>
										</span>
										<div className='ml-1 flex items-center text-xs'>
											<img
												className='h-5 w-5'
												alt='miles ticket'
												src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2FMilesTicket.png?alt=media&token=f8e4f60a-1546-4084-9498-0f6f9e765859'
											/>
											{item.price}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
					{/* Item List */}

					{/* Total MilesTicket Count */}
					<div className='mb-5 flex justify-end border-b border-gray-200'>
						<div className='w-30 flex items-center justify-between p-3'>
							<span className='mr-2 text-sm font-semibold'>일괄</span>

							<div className='flex items-center rounded-md bg-white px-1 py-0.5'>
								<img
									className='mr-1 h-5 w-5'
									alt='miles ticket'
									src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2FMilesTicket.png?alt=media&token=f8e4f60a-1546-4084-9498-0f6f9e765859'
								/>
								<span className='text-md font-semibold'>
									{data.cart && data.cart.reduce((acc: number, cur: cartItem) => acc + Number(cur.quantity) * Number(cur.price), 0)}
								</span>
							</div>
						</div>
					</div>
					{/* Total MilesTicket Count */}

					<Comment
						done={data.done}
						postCreatorId={data.creatorId}
						comments={comments}
						setComments={setComments}
						id={data.id}
						getComments={getComments}
					/>
				</div>
			)}
		</div>
	);
};

export default PostDetail;
