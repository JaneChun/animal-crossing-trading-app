import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { cartItem, item } from '../../Pages/NewPost';
import spinner from '../../Images/spinner.gif';
import Toast from './Toast';
import UserAdd from './UserAdd';

interface ItemSelectProps {
	isDropdownOpen: boolean;
	setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
	cart: cartItem[];
	setCart: React.Dispatch<React.SetStateAction<cartItem[]>>;
}

const ItemSelect = ({ isDropdownOpen, setIsDropdownOpen, cart, setCart }: ItemSelectProps) => {
	const [category, setCategory] = useState<string>('');
	const [itemData, setItemData] = useState<item[]>([]);
	const [searchInput, setSearchInput] = useState<string>('');
	const [filteredData, setFilteredData] = useState<item[]>([]);
	const [isToastVisible, setIsToastVisible] = useState(false);

	const getData = async () => {
		if (!category) return;

		const response = await axios.get(`${process.env.REACT_APP_DATABASE_URL}/items/${category}.json`);
		if (response.status === 200) {
			setItemData(response.data);
		} else {
			throw new Error(response.statusText);
		}
	};

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category]);

	useEffect(() => {
		const filtered = itemData.filter((item) => item.name.includes(searchInput));
		setFilteredData(filtered);
	}, [searchInput, itemData]);

	const addItemToCart = (item: item) => {
		const isAdded = cart.find((cartItem) => cartItem.UniqueEntryID === item.UniqueEntryID);
		if (isAdded === undefined) {
			setCart((cart) => [...cart, { ...item, quantity: 1, price: 1 }]);
		}
		setIsToastVisible(true);
		setTimeout(() => {
			setIsToastVisible(false);
		}, 1000);
	};

	const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const categorySelectHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { value } = e.target as HTMLButtonElement;
		setCategory(value);
		setIsDropdownOpen(false);
	};

	return (
		<div className='relative'>
			{/* Toast */}
			<div className='flex justify-center'>
				<Toast isToastVisible={isToastVisible} />
			</div>
			<label htmlFor='item' className='mb-2 block text-sm font-medium text-gray-900 '>
				아이템
			</label>
			<button
				id='item'
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				className='inline-flex items-center rounded-lg bg-mint px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-hover-mint focus:outline-none focus:ring-4 focus:ring-ring-mint'
				type='button'
			>
				{category === '' ? '아이템 선택' : categories.find((item) => item.EN === category)?.KR}
				<svg className='ml-2 h-4 w-4' aria-hidden='true' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
				</svg>
			</button>

			{/* Category Dropdown */}
			<div className={`${!isDropdownOpen && 'hidden'} + z-10 mt-2 w-36 divide-y divide-gray-100 rounded-lg bg-white shadow`}>
				<ul className='h-48 overflow-y-auto py-2 text-sm text-gray-700' aria-labelledby='multiLevelDropdownButton'>
					{categories.map((category) => (
						<li key={category.EN}>
							<button onClick={categorySelectHandler} value={category.EN} className='block w-full px-4 py-2 text-left hover:bg-gray-100'>
								{category.KR}
							</button>
						</li>
					))}
				</ul>
			</div>
			{/* Category Dropdown */}

			{/* Item Search Dropdown */}
			<div className={`${(!category || isDropdownOpen) && 'hidden'} w-72 rounded-lg bg-white shadow`}>
				<div className='p-3'>
					<label htmlFor='input-search' className='sr-only'>
						Search
					</label>
					<div className='relative'>
						{/* Search Icon */}
						<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
							<svg className='h-5 w-5 text-gray-500' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
								<path
									fillRule='evenodd'
									d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
									clipRule='evenodd'
								></path>
							</svg>
						</div>

						{/* Search Input */}
						<input
							onChange={searchInputHandler}
							value={searchInput}
							type='text'
							id='input-search'
							className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-ring-mint'
							placeholder='Search'
						/>

						{/* X button */}
						{searchInput !== '' && (
							<button onClick={() => setSearchInput('')} className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2 text-gray-500'>
								<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
									<path
										fill='none'
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M12 12L6 6m6 6l6 6m-6-6l6-6m-6 6l-6 6'
									/>
								</svg>
							</button>
						)}
					</div>
				</div>

				<ul className='h-60 overflow-y-auto px-3 pb-3 text-sm text-gray-700' aria-labelledby='dropdownSearchButton'>
					{category && itemData.length !== 0 ? (
						!searchInput ? (
							itemData.map((item: item) => <ListUnit key={item.UniqueEntryID + item.color} item={item} addItemToCart={addItemToCart} />)
						) : filteredData.length > 0 ? (
							filteredData.map((item: item) => <ListUnit key={item.UniqueEntryID + item.color} item={item} addItemToCart={addItemToCart} />)
						) : (
							<UserAdd setCart={setCart} />
						)
					) : (
						<div className='flex h-full w-full items-center justify-center'>
							<img src={spinner} alt='loading' className='h-28' />
						</div>
					)}
				</ul>
			</div>
			{/* Item Search Dropdown */}
		</div>
	);
};

export default ItemSelect;

interface listUnitProps {
	item: item;
	addItemToCart: (item: item) => void;
}

const ListUnit = ({ item, addItemToCart }: listUnitProps) => {
	return (
		<li>
			<button onClick={() => addItemToCart(item)} className='flex w-full items-center whitespace-nowrap px-4 py-2 hover:bg-gray-100'>
				<img className='mr-2 h-6 w-6 rounded-full' src={item.imageUrl} alt={`${item.name}`} />
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
