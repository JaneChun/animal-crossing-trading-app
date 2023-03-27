import React, { useState, useEffect } from 'react';
import { auth, db } from '../fbase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import CartItem from '../Components/CartItem';

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
	const userInfo = auth.currentUser;
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [category, setCategory] = useState<string>('');
	const [itemData, setItemData] = useState<item[]>([]);
	const [cart, setCart] = useState<cartItem[]>([]);
	const [searchInput, setSearchInput] = useState<string>('');
	const [filteredData, setFilteredData] = useState<item[]>([]);
	const [userAddInput, setUserAddInput] = useState<string>('');

	const databaseURL = process.env.REACT_APP_DATABASE_URL;

	useEffect(() => {
		getData();
	}, [category]);

	useEffect(() => {
		const filtered = itemData.filter((item) => item.name.includes(searchInput));
		setFilteredData(filtered);
	}, [searchInput]);

	const getData = async () => {
		if (!category) return;

		const response = await axios.get(`${databaseURL}/items/${category}.json`);
		if (response.status === 200) {
			setItemData(response.data);
		} else {
			throw new Error(response.statusText);
		}
	};

	const userAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserAddInput(e.target.value);
	};

	const addUserInputItemToCart = () => {
		if (userAddInput) {
			const userInputItem: item = {
				UniqueEntryID: uuidv4(),
				imageUrl: 'https://dodo.ac/np/images/thumb/5/55/Furniture_Leaf_NH_Category_Icon.png/120px-Furniture_Leaf_NH_Category_Icon.png',
				name: userAddInput,
			};
			setCart((cart) => [...cart, { ...userInputItem, quantity: 1, price: 1 }]);
		}
		setUserAddInput('');
	};

	const addItemToCart = (item: item) => {
		const isAdded = cart.find((cartItem) => cartItem.UniqueEntryID === item.UniqueEntryID);
		if (isAdded === undefined) {
			setCart((cart) => [...cart, { ...item, quantity: 1, price: 1 }]);
		}
	};

	const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const categorySelectHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { value } = e.target as HTMLButtonElement;
		setCategory(value);
		setIsDropdownOpen(false);
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
			await setDoc(doc(db, 'Boards', `/${uuidv4()}`), requestData);
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
		<div className='absolute top-[calc(61px)] min-h-[calc(100vh-61px)] w-screen p-5'>
			<div className='inline-flex rounded-md shadow-sm' role='group'>
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

			<label htmlFor='default-textarea' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
				아이템
			</label>
			<button
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				id='dropdownSearchButton'
				data-dropdown-toggle='dropdownSearch'
				data-dropdown-placement='bottom'
				className='inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
				type='button'
			>
				{category === '' ? '아이템 선택' : categories.find((item) => item.EN === category)?.KR}
				<svg className='ml-2 h-4 w-4' aria-hidden='true' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
				</svg>
			</button>

			{/* Category Dropdown */}
			<div
				id='dropdown'
				className={`${!isDropdownOpen && 'hidden'} + z-10 mt-2 w-36 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700`}
			>
				<ul className='h-48 overflow-y-auto py-2 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='multiLevelDropdownButton'>
					{categories.map((category) => (
						<li key={category.EN}>
							<button
								onClick={categorySelectHandler}
								value={category.EN}
								className='block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
							>
								{category.KR}
							</button>
						</li>
					))}
				</ul>
			</div>
			{/* Category Dropdown */}

			{/* Item Search Dropdown */}
			<div id='dropdownSearch' className={`${(!category || isDropdownOpen) && 'hidden'} z-10 w-72 rounded-lg bg-white shadow dark:bg-gray-700`}>
				<div className='p-3'>
					<label htmlFor='input-group-search' className='sr-only'>
						Search
					</label>
					<div className='relative'>
						<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
							<svg
								className='h-5 w-5 text-gray-500 dark:text-gray-400'
								aria-hidden='true'
								fill='currentColor'
								viewBox='0 0 20 20'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>

						<input
							onChange={searchInputHandler}
							value={searchInput}
							type='text'
							id='input-group-search'
							className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
							placeholder='Search'
						/>

						{searchInput !== '' && (
							<button onClick={() => setSearchInput('')} className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2 text-gray-500'>
								<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
									<path
										fill='none'
										stroke='currentColor'
										stroke-linecap='round'
										stroke-linejoin='round'
										stroke-width='2'
										d='M12 12L6 6m6 6l6 6m-6-6l6-6m-6 6l-6 6'
									/>
								</svg>
							</button>
						)}
					</div>
				</div>

				<ul className='h-60 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownSearchButton'>
					{category && itemData.length !== 0 ? (
						!searchInput ? (
							itemData.map((item: item) => <ListUnit key={item.UniqueEntryID} item={item} addItemToCart={addItemToCart} />)
						) : filteredData.length > 0 ? (
							filteredData.map((item: item) => <ListUnit key={item.UniqueEntryID} item={item} addItemToCart={addItemToCart} />)
						) : (
							<div>
								<label htmlFor='user-add-input' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
									직접 추가하기
								</label>

								<div className='relative flex w-full'>
									<input
										onChange={userAddInputHandler}
										value={userAddInput}
										type='text'
										id='user-add-input'
										className='block grow rounded-lg border border-gray-300 bg-gray-50 p-2 pl-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
										placeholder='아이템 이름을 입력하세요'
									/>
									<button
										onClick={addUserInputItemToCart}
										className='ml-2 flex h-[calc(38px)] w-[calc(38px)] items-center justify-center rounded-lg border border-blue-700 bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
									>
										<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
											<path fill='currentColor' d='M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z' />
										</svg>
									</button>
								</div>
							</div>
						)
					) : (
						<div className='flex h-full w-full items-center justify-center'>
							<div role='status'>
								<svg
									aria-hidden='true'
									className='mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
									viewBox='0 0 100 101'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
										fill='currentColor'
									/>
									<path
										d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
										fill='currentFill'
									/>
								</svg>
								<span className='sr-only'>Loading...</span>
							</div>
						</div>
					)}
				</ul>
			</div>
			{/* Item Search Dropdown */}

			{/* Cart */}
			<div className='mt-5 flex flex-wrap'>
				{cart && cart.map((item) => <CartItem key={item.UniqueEntryID} item={item} cart={cart} setCart={setCart} />)}
			</div>

			<div className='mt-5 mb-[calc(41px)] flex justify-end'>
				<button
					onClick={onSubmit}
					className='mb-5 rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white'
				>
					작성
				</button>
			</div>
		</div>
	);
};

export default NewPost;

interface listUnitProps {
	key: string;
	item: item;
	addItemToCart: (item: item) => void;
}

const ListUnit = ({ item, addItemToCart }: listUnitProps) => {
	return (
		<li>
			<button
				onClick={() => addItemToCart(item)}
				className='flex w-full items-center whitespace-nowrap px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
			>
				<img className='mr-2 h-6 w-6 rounded-full' src={item.imageUrl} alt='Jese image' />
				{item.name} {item.color && `(${item.color})`}
			</button>
		</li>
	);
};

const categories = [
	{
		KR: '가구',
		EN: 'Houswares',
	},
	{
		KR: '잡화',
		EN: 'Miscellaneous',
	},
	{
		KR: '벽걸이',
		EN: 'Wallmounted',
	},
	{
		KR: '레시피',
		EN: 'Recipes',
	},
	{
		KR: '요리',
		EN: 'Food',
	},
	{
		KR: '모자',
		EN: 'Headwear',
	},
	{
		KR: '상의',
		EN: 'Tops',
	},
	{
		KR: '하의',
		EN: 'Bottoms',
	},
	{
		KR: '원피스',
		EN: 'DressUp',
	},
	{
		KR: '양말',
		EN: 'Socks',
	},
	{
		KR: '가방',
		EN: 'Bags',
	},
	{
		KR: '신발',
		EN: 'Shoes',
	},
	{
		KR: '악세사리',
		EN: 'Accessories',
	},
	{
		KR: '우산',
		EN: 'Umbrellas',
	},
	{
		KR: '천장',
		EN: 'CeilingDecor',
	},
	{
		KR: '벽지',
		EN: 'Wallpaper',
	},
	{
		KR: '바닥',
		EN: 'Floors',
	},
	{
		KR: '러그',
		EN: 'Rugs',
	},
	{
		KR: '음악',
		EN: 'Music',
	},
	{
		KR: '토용',
		EN: 'Gyroids',
	},
];
