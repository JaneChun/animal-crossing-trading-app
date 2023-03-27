import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../fbase';
import { doc, getDoc, DocumentData, deleteDoc } from 'firebase/firestore';
import { elapsedTime } from '../Utilities/elapsedTime';
import { cartItem } from './NewPost';

function PostDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState<DocumentData>({});
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const modalRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const docRef = doc(db, 'Boards', `${id}`);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const docData = docSnap.data();
			setData({ ...docData, id });
		} else {
			console.log('no such document!');
		}
	};

	const editPost = () => {
		navigate(`/post-edit/${id}`, {
			state: {
				id,
			},
		});
	};

	const deletePost = async () => {
		const confirm = window.confirm('정말로 삭제하겠습니까?');

		if (confirm) {
			try {
				await deleteDoc(doc(db, 'Boards', data.id));
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

	return (
		<div onClick={handleOutsideClick} className='absolute top-[calc(61px)] min-h-[calc(100vh-61px)] w-screen p-5'>
			{data && (
				<div className='relative mx-2 mb-10'>
					{/* Type */}
					<div>
						{data.type === 'sell' ? (
							<span className='-ml-1 rounded-sm border border-blue-100 bg-blue-100 py-1 px-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
								{/* 거래 완료 - <span className='-ml-1 rounded-sm border border-gray-200 bg-white py-1 px-2 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'> */}
								팔아요
							</span>
						) : (
							<span className='-ml-1 rounded-sm bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white  dark:bg-blue-600'>구해요</span>
						)}
					</div>
					{/* Type */}

					{/* Dots Button */}
					<button
						ref={modalRef}
						onClick={handleModal}
						id='dropdownMenuIconButton'
						data-dropdown-toggle='dropdownDots'
						className='absolute top-0 right-0 inline-flex items-center rounded-lg bg-white p-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600'
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
						className={`${
							!isModalOpen && 'hidden'
						} + absolute top-8 right-0 z-10 w-auto divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700`}
					>
						<ul className='py-2 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownMenuIconButton'>
							<li>
								<button onClick={editPost} className='block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
									수정
								</button>
							</li>
							<li>
								<button onClick={deletePost} className='block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
									삭제
								</button>
							</li>
						</ul>
					</div>
					{/* Dropdown */}

					{/* Text Data */}
					<div className='mt-3 mb-1 text-xl font-semibold text-gray-900 dark:text-white'>{data.title}</div>
					<div className='border-b border-gray-200 pb-3'>
						<div>
							<span className='text-md mr-2 mb-1 font-semibold text-gray-500 dark:text-gray-400'>{data.creatorDisplayName?.split(' ')[0]}</span>
							<span className='mr-2 mb-1 text-sm font-normal text-gray-500 dark:text-gray-400'>🏝 {data.creatorDisplayName?.split(' ')[1]}</span>
						</div>
					</div>
					<div className='mt-4 mb-4 p-1 text-base font-normal text-gray-500 dark:text-gray-400'>{data.body}</div>
					{/* Text Data */}

					{/* Item List */}
					<ul className='h-auto overflow-y-auto py-2 text-gray-700 dark:text-gray-200' aria-labelledby='dropdownUsersButton'>
						{data.cart?.map((item: cartItem) => (
							<li className='mb-2 rounded-md bg-gray-100' key={item.UniqueEntryID}>
								<div className='flex justify-between px-4 py-2'>
									<div className='flex items-center'>
										<img className='mr-2 h-6 w-6 rounded-md' src={item.imageUrl} alt={item.name} />
										<span className='mr-2 text-base font-semibold'>{item.name}</span>
										<span className='text-sm font-normal text-gray-400 dark:text-gray-400'>{item.color && item.color}</span>
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
					<div className='flex justify-end'>
						<div className='w-30 flex items-center justify-between p-3'>
							<span className='mr-2 text-sm font-semibold'>일괄</span>

							<div className='flex items-center rounded-md bg-white px-1 py-0.5'>
								<img
									className='mr-1 h-5 w-5'
									src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2FMilesTicket.png?alt=media&token=f8e4f60a-1546-4084-9498-0f6f9e765859'
								/>
								<span className='text-md font-semibold'>
									{data.cart && data.cart.reduce((acc: number, cur: cartItem) => acc + Number(cur.quantity) * Number(cur.price), 0)}
								</span>
							</div>
						</div>
					</div>
					{/* Total MilesTicket Count */}

					{/* <a
						href='#'
						className='inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700'
					>
						채팅하기
						<svg className='ml-2 h-3 w-3' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
							<path
								fill-rule='evenodd'
								d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
								clip-rule='evenodd'
							></path>
						</svg>
					</a> */}
				</div>
			)}
		</div>
	);
}

export default PostDetail;
