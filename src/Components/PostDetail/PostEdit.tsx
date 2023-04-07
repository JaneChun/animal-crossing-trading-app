import React, { useState, useEffect, useContext } from 'react';
import { auth, db } from '../../fbase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import CartItem from '../../Components/NewPost/CartItem';
import ItemSelect from '../../Components/NewPost/ItemSelect';
import { cartItem } from '../../Pages/NewPost';
import { AuthContext } from '../../context/AuthContext';

const PostEdit = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [type, setType] = useState<string>('buy');
	const [title, setTitle] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const { userInfo } = useContext(AuthContext);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [cart, setCart] = useState<cartItem[]>([]);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const docRef = doc(db, 'Boards', `${state.id}`);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const docData = docSnap.data();
			setType(docData.type);
			setTitle(docData.title);
			setBody(docData.body);
			setCart(docData.cart);
		} else {
			console.log('no such document!');
		}
	};

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

	const onCancel = () => {
		navigate(`/post/${state.id}`);
	};

	const onSubmit = async () => {
		const requestData = {
			type,
			title,
			body,
			cart,
			cartList: cart.map((item) => item.name),
			creatorDisplayName: userInfo?.displayName,
			creatorId: userInfo?.uid,
			done: false,
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
			await updateDoc(doc(db, 'Boards', state.id), requestData);
			alert('수정했습니다.');
			navigate(`/post/${state.id}`);
		} catch (error) {
			console.log(error);
		} finally {
			setTitle('');
			setBody('');
		}
	};

	return (
		<div className='absolute top-[calc(61px)] min-h-[calc(100vh-61px)] w-screen p-5'>
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
					rows={10}
					className='sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
				/>
			</div>
			{/* Body */}

			<ItemSelect isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} cart={cart} setCart={setCart} />

			{/* Cart */}
			<div className='mt-5 flex flex-wrap justify-center'>
				{cart && cart.map((item) => <CartItem key={item.UniqueEntryID} item={item} cart={cart} setCart={setCart} />)}
			</div>
			{/* Cart */}

			<div className='mt-5 mb-[calc(41px)] flex justify-end'>
				<button
					onClick={onCancel}
					className='mr-2 mb-5 rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white'
				>
					취소
				</button>
				<button
					onClick={onSubmit}
					className='mb-5 rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white'
				>
					수정
				</button>
			</div>
		</div>
	);
};

export default PostEdit;
