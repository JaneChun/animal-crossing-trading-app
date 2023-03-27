import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../fbase';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { elapsedTime } from '../Utilities/elapsedTime';
import { cartItem } from './NewPost';
import MilesTicket from '../Images/MilesTicket.png';

function PostDetail() {
	const { id } = useParams();
	const [data, setData] = useState<DocumentData>({});

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const docRef = doc(db, 'Boards', `${id}`);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const docData = docSnap.data();
			setData(docData);
		} else {
			console.log('no such document!');
		}
	};
	console.log('data.cart', data.cart);
	return (
		<div className='absolute top-[calc(61px)] min-h-[calc(100vh-61px)] w-screen p-5'>
			{data && (
				<div className='mx-2 mb-10'>
					{data.type === 'sell' ? (
						<span className='-ml-1 rounded-sm border border-blue-100 bg-blue-100 py-1 px-2 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
							{/* 거래 완료 - <span className='-ml-1 rounded-sm border border-gray-200 bg-white py-1 px-2 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'> */}
							팔아요
						</span>
					) : (
						<span className='-ml-1 rounded-sm bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white  dark:bg-blue-600'>구해요</span>
					)}
					<div className='mt-3 mb-1 text-xl font-semibold text-gray-900 dark:text-white'>{data.title}</div>
					<div className='border-b border-gray-200 pb-3'>
						<div>
							<span className='text-md mr-2 mb-1 font-semibold text-gray-500 dark:text-gray-400'>{data.creatorDisplayName?.split(' ')[0]}</span>
							<span className='mr-2 mb-1 text-sm font-normal text-gray-500 dark:text-gray-400'>🏝 {data.creatorDisplayName?.split(' ')[1]}</span>
						</div>
						<div className='mt-2 mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500'>{elapsedTime(data.createdAt)}</div>
					</div>
					<div className='mt-4 mb-4 p-1 text-base font-normal text-gray-500 dark:text-gray-400'>{data.body}</div>

					<ul className='h-auto overflow-y-auto py-2 text-gray-700 dark:text-gray-200' aria-labelledby='dropdownUsersButton'>
						{data.cart?.map((item: cartItem) => (
							<li className='mb-2 rounded-md bg-gray-100' key={item.UniqueEntryID}>
								<div className='flex justify-between px-4 py-2'>
									<div className='flex items-center'>
										<img className='mr-2 h-6 w-6 rounded-full' src={item.imageUrl} alt={item.name} />
										<span className='mr-2 text-base font-semibold'>{item.name}</span>
										<span className='text-sm font-normal text-gray-400 dark:text-gray-400'>{item.color && item.color}</span>
									</div>

									<div className='flex items-center'>
										<span className='text-xs'>{item.quantity}개</span>
										<span className='ml-1.5'>
											<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 32 32'>
												<path
													fill='currentColor'
													d='M7.223 2.893a3.072 3.072 0 0 0-4.33 0a3.084 3.084 0 0 0 0 4.34l8.747 8.744l-8.737 8.745a3.072 3.072 0 0 0 0 4.33a3.072 3.072 0 0 0 4.33 0l8.74-8.744l8.74 8.735a3.072 3.072 0 0 0 4.33 0a3.072 3.072 0 0 0 0-4.33l-8.738-8.739l8.747-8.752a3.072 3.072 0 0 0 0-4.33c-1.2-1.19-3.15-1.19-4.34 0l-8.74 8.75l-8.75-8.75Z'
												/>
											</svg>
										</span>
										<div className='ml-1 flex items-center text-xs'>
											<img className='h-5 w-5' src={MilesTicket} />
											{item.price}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>

					{/* Total MilesTicket Count */}
					<div className='flex justify-end'>
						<div className='w-30 flex items-center justify-between p-3'>
							<span className='mr-2 text-sm font-semibold'>일괄</span>

							<div className='flex items-center rounded-md bg-white px-1 py-0.5'>
								<img className='h-5 w-5' src={MilesTicket} />
								<span className='text-md font-semibold'>
									{data.cart && data.cart.reduce((acc: number, cur: cartItem) => acc + Number(cur.quantity) * Number(cur.price), 0)}
								</span>
							</div>
						</div>
					</div>

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
