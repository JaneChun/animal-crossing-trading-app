import React, { useContext, useState } from 'react';
import { auth, db } from '../fbase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CartItem from '../Components/NewPost/CartItem';
import ItemSelect from '../Components/NewPost/ItemSelect';
import { AuthContext } from '../context/AuthContext';

export interface item {
	UniqueEntryID: string;
	imageUrl: string;
	name: string;
	color?: string;
}

export interface cartItem extends item {
	quantity: number;
	price: number;
}

const NewPost = () => {
	const navigate = useNavigate();
	const [type, setType] = useState<string>('buy');
	const [title, setTitle] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const { userInfo } = useContext(AuthContext);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [cart, setCart] = useState<cartItem[]>([]);

	const typeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { name } = e.target as HTMLButtonElement;
		setType(name);
	};

	const titleInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const bodyInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setBody(e.target.value);
	};

	const onSubmit = async () => {
		const requestData = {
			type,
			title,
			body,
			cart,
			createdAt: Date.now(),
			creatorDisplayName: userInfo?.displayName,
			creatorId: userInfo?.uid,
			done: false,
			comments: 0,
		};

		if (!userInfo) return;

		if (type === '') {
			alert('거래 종류를 선택해주세요.');
			return;
		}

		if (title === '' || body === '') {
			alert('제목이나 내용이 비어있는지 확인해주세요.');
			return;
		}
		try {
			const docId = uuidv4();
			const docRef = doc(db, 'Boards', docId);
			await setDoc(docRef, requestData);
			alert('작성했습니다.');
			navigate('/');
		} catch (error) {
			console.log(error);
		} finally {
			setTitle('');
			setBody('');
		}
	};

	return (
		<div className='absolute top-[calc(61px)] h-[calc(100vh-121px)] w-screen overflow-y-auto p-5'>
			<div className='inline-flex rounded-md shadow-sm' role='group'>
				{/* Type */}
				<button
					onClick={typeHandler}
					name='buy'
					type='button'
					className={`${
						type === 'buy' ? 'bg-gray-100 text-blue-700' : 'bg-white text-gray-900'
					} rounded-l-lg border border-gray-200  px-4 py-2 text-sm font-medium  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500`}
				>
					구해요
				</button>
				{/* <button
					type='button'
					className='border-t border-b border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500'
				>
					판매
				</button> */}
				<button
					onClick={typeHandler}
					name='sell'
					type='button'
					className={`${
						type === 'sell' ? 'bg-gray-100 text-blue-700' : 'bg-white text-gray-900'
					} rounded-r-lg border border-gray-200  px-4 py-2 text-sm font-medium  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500`}
				>
					팔아요
				</button>
			</div>
			{/* Type */}

			{/* Title */}
			<div className='mt-5 mb-6'>
				<label htmlFor='default-input' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
					제목
				</label>
				<input
					value={title}
					onChange={titleInputHandler}
					placeholder='DIY 작업대 레시피 구해요 :)'
					type='text'
					id='default-input'
					className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
				/>
			</div>
			{/* Title */}

			{/* Body */}
			<div className='mb-6'>
				<label htmlFor='default-textarea' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
					내용
				</label>
				<textarea
					onChange={bodyInputHandler}
					value={body}
					placeholder='2마일에 구매하고 싶어요. 채팅 주세요!'
					id='default-textarea'
					className='sm:text-md block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
				/>
			</div>
			{/* Body */}

			<ItemSelect isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} cart={cart} setCart={setCart} />

			{/* Cart */}
			<div className='mt-5 flex flex-wrap justify-center'>
				{cart && cart.map((item) => <CartItem key={item.UniqueEntryID} item={item} cart={cart} setCart={setCart} />)}
			</div>
			{/* Cart */}

			<div className='mt-3 flex justify-end'>
				<button
					onClick={onSubmit}
					className='rounded-lg border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white'
				>
					작성
				</button>
			</div>
		</div>
	);
};

export default NewPost;
