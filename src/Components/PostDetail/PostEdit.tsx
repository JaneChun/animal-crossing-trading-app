import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartItem from '../../Components/NewPost/CartItem';
import ItemSelect from '../../Components/NewPost/ItemSelect';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../fbase';
import { cartItem } from '../../Pages/NewPost';

const PostEdit = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const [type, setType] = useState<string>('buy');
	const [title, setTitle] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const { userInfo } = useContext(AuthContext);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [cart, setCart] = useState<cartItem[]>([]);

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

	useEffect(() => {
		getData();
	}, []);

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
		<div className='custom-container p-5'>
			<div className='inline-flex rounded-md shadow-sm' role='group'>
				{/* Type */}
				<button
					onClick={typeHandler}
					name='buy'
					type='button'
					className={`${
						type === 'buy' ? 'bg-gray-100 text-mint' : 'bg-white text-gray-900'
					} rounded-l-lg border border-gray-200  px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-mint focus:z-10 focus:text-mint focus:ring-2 focus:ring-ring-mint`}
				>
					구해요
				</button>
				<button
					onClick={typeHandler}
					name='sell'
					type='button'
					className={`${
						type === 'sell' ? 'bg-gray-100 text-mint' : 'bg-white text-gray-900'
					} rounded-r-lg border border-gray-200  px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-mint focus:z-10 focus:text-mint focus:ring-2 focus:ring-ring-mint`}
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
					onClick={onSubmit}
					className='mr-2 rounded-lg border border-mint bg-mint py-2 px-4 font-semibold text-white hover:bg-hover-mint focus:ring-4 focus:ring-ring-mint'
				>
					수정
				</button>
				<button
					onClick={onCancel}
					className='rounded-lg border border-mint bg-transparent py-2 px-4 font-semibold text-mint hover:border-transparent hover:bg-mint hover:text-white focus:ring-4 focus:ring-ring-mint'
				>
					취소
				</button>
			</div>
		</div>
	);
};

export default PostEdit;
