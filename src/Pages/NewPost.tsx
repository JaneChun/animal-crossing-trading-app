import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CartItem from '../Components/NewPost/CartItem';
import ItemSelect from '../Components/NewPost/ItemSelect';
import { AuthContext } from '../Context/AuthContext';
import { db } from '../fbase';
import { uploadFile } from '../Utilities/uploadFile';

export interface item {
	UniqueEntryID: string;
	imageUrl: string;
	name: string;
	color?: string;
}

export interface cartItem extends item {
	quantity: number;
	price: number;
	createdAt?: Timestamp;
}

const NewPost = () => {
	const navigate = useNavigate();
	const { userInfo } = useContext(AuthContext);
	const [type, setType] = useState<string>('buy');
	const [title, setTitle] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const [cart, setCart] = useState<cartItem[]>([]);
	const [fileURLString, setFileURLString] = useState<any>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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

		let requestData = {
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
			photoURL: '',
		};
		const docId = uuidv4();

		if (type === '') {
			alert('거래 종류를 선택해주세요.');
			return;
		}

		if (title === '' || body === '') {
			alert('제목이나 내용이 비어있는지 확인해주세요.');
			return;
		}

		if (fileURLString) {
			const photoURL = await uploadFile(fileURLString, 'BoardImages', docId);
			requestData = { ...requestData, photoURL };
		}

		try {
			const docRef = doc(db, 'Boards', docId);
			await setDoc(docRef, requestData);
			alert('작성했습니다.');
			navigate(`/post/${docId}`);
		} catch (error) {
			console.log(error);
		} finally {
			setTitle('');
			setBody('');
			setFileURLString(null);
		}
	};

	const fileInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const file = files[0];

			const reader = new FileReader();
			reader.onloadend = () => {
				setFileURLString(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const deleteFileInput = () => {
		setFileURLString(null);
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

			<div className='mb-6'>
				<label htmlFor='default-textarea' className='mb-2 block text-sm font-medium text-gray-900'>
					사진
				</label>
				{/* photo */}
				<div className='group relative flex w-full items-center justify-center'>
					<label
						htmlFor='dropzone-file'
						className='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
					>
						<div className='flex flex-col items-center justify-center pt-5 pb-6'>
							<svg
								aria-hidden='true'
								className='mb-3 h-10 w-10 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
								></path>
							</svg>
							<p className='mb-2 text-sm text-gray-500'>
								<span className='font-semibold'>Click to upload</span> or drag and drop
							</p>
							<p className='text-xs text-gray-500'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
						</div>
						<input onChange={fileInputHandler} id='dropzone-file' type='file' className='hidden' />
					</label>
					{fileURLString && (
						<>
							<img
								className='absolute h-64 w-full cursor-pointer rounded-lg object-cover brightness-100 group-hover:brightness-75'
								alt='thumbnail'
								src={fileURLString}
							/>
							<div
								onClick={deleteFileInput}
								className='invisible absolute z-10 flex w-full justify-center text-white hover:visible group-hover:visible'
							>
								<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'>
									<mask id='ipSDeleteFour0'>
										<g fill='none' stroke='#fff' strokeLinejoin='round' strokeWidth='4'>
											<path strokeLinecap='round' d='M8 11h32M18 5h12' />
											<path fill='#fff' d='M12 17h24v23a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V17Z' />
										</g>
									</mask>
									<path fill='currentColor' d='M0 0h48v48H0z' mask='url(#ipSDeleteFour0)' />
								</svg>
							</div>
						</>
					)}
				</div>
				{/* photo */}
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
