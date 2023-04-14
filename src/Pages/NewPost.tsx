import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CartItem from '../Components/NewPost/CartItem';
import ItemSelect from '../Components/NewPost/ItemSelect';
import { AuthContext } from '../context/AuthContext';
import { db } from '../fbase';

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
		if (!userInfo) {
			alert('글 쓰기는 로그인 후 가능합니다.');
			navigate('/login');
			return;
		}

		const requestData = {
			type,
			title,
			body,
			cart,
			cartList: cart.map((item) => item.name),
			createdAt: serverTimestamp(),
			creatorDisplayName: userInfo.displayName,
			creatorIslandName: userInfo.islandName,
			creatorRating: userInfo.rating,
			creatorCount: userInfo.count,
			creatorId: userInfo?.uid,
			done: false,
			comments: 0,
		};

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
				<label htmlFor='default-input' className='mb-2 block text-sm font-medium text-gray-900'>
					제목
				</label>
				<input
					value={title}
					onChange={titleInputHandler}
					placeholder='DIY 작업대 레시피 구해요 :)'
					type='text'
					id='default-input'
					className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-ring-mint'
				/>
			</div>
			{/* Title */}

			{/* Body */}
			<div className='mb-6'>
				<label htmlFor='default-textarea' className='mb-2 block text-sm font-medium text-gray-900'>
					내용
				</label>
				<textarea
					rows={10}
					onChange={bodyInputHandler}
					value={body}
					placeholder='2마일에 구매하고 싶어요. 채팅 주세요!'
					id='default-textarea'
					className='sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-ring-mint'
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
					className='rounded-lg border border-mint bg-transparent py-2 px-4 font-semibold text-mint hover:border-transparent hover:bg-mint hover:text-white focus:ring-4 focus:ring-ring-mint'
				>
					작성
				</button>
			</div>
		</div>
	);
};

export default NewPost;
