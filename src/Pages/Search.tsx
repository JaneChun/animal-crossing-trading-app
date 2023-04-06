import { collection, DocumentData, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import PostUnit from '../Components/PostUnit';
import { db } from '../fbase';

const Search = () => {
	const [searchInput, setSearchInput] = useState<string>('');
	const [data, setData] = useState<DocumentData[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [filter, setFilter] = useState<string>('buy');

	const searchInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setData([]);

		const q = query(
			collection(db, 'Boards'),
			where('type', '==', filter),
			where('cartList', 'array-contains', searchInput),
			orderBy('createdAt', 'desc'),
			limit(10)
		);
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			const docObj = {
				...doc.data(),
				id: doc.id,
			};
			setData((data) => [...data, docObj]);
		});
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { id } = e.target as HTMLButtonElement;
		setFilter(id);
		setIsDropdownOpen(false);
	};

	return (
		<div className='absolute top-[calc(61px)] h-[calc(100vh-121px)] w-screen overflow-y-auto p-5'>
			<form onSubmit={onSubmit}>
				<div className='relative flex'>
					<button
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						id='dropdown-button'
						data-dropdown-toggle='dropdown'
						className='absolute z-10 inline-flex flex-shrink-0 items-center rounded-l-lg border border-gray-300 bg-gray-100 py-2.5 px-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none'
						type='button'
					>
						{filter === 'buy' ? '구해요' : '팔아요'}
						<svg aria-hidden='true' className='ml-1 h-4 w-4' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
							<path
								fillRule='evenodd'
								d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
								clipRule='evenodd'
							></path>
						</svg>
					</button>

					{/* Dropdown */}
					{isDropdownOpen && (
						<div
							id='dropdown'
							className='absolute top-11 z-10 w-28 divide-y divide-gray-100 rounded-lg bg-white shadow focus:ring-4 focus:ring-ring-mint'
						>
							<ul className='py-2 text-sm text-gray-700' aria-labelledby='dropdown-button'>
								<li>
									<button onClick={handleClick} id='buy' type='button' className='inline-flex w-full px-4 py-2 hover:bg-gray-100'>
										구해요
									</button>
								</li>
								<li>
									<button onClick={handleClick} id='sell' type='button' className='inline-flex w-full px-4 py-2 hover:bg-gray-100'>
										팔아요
									</button>
								</li>
							</ul>
						</div>
					)}
					{/* Dropdown */}

					<div className='relative w-full'>
						<input
							value={searchInput}
							onChange={searchInputHandler}
							type='search'
							id='search-dropdown'
							className='z-20 block w-full rounded-lg border border-l-2 border-gray-300 border-l-gray-50 bg-gray-50 p-2.5 pl-[88px] text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-ring-mint'
							placeholder='아이템 이름을 입력해주세요.'
							required
						/>
						<button
							type='submit'
							className='absolute top-0 right-0 rounded-r-lg border border-mint bg-mint p-2.5 text-sm font-medium text-white hover:bg-hover-mint focus:outline-none focus:ring-4 focus:ring-ring-mint'
						>
							<svg aria-hidden='true' className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
							</svg>
							<span className='sr-only'>Search</span>
						</button>
					</div>
				</div>
			</form>

			<div className='mt-6 mb-4 flex items-center justify-between'>
				<div className='text-lg font-bold leading-none text-gray-900'>검색 결과</div>
			</div>
			<ul role='list' className='divide-y divide-gray-200'>
				{data.map(
					(doc) =>
						doc.createdAt && (
							<PostUnit
								key={doc.id}
								id={doc.id}
								page={'Home'}
								type={doc.type}
								title={doc.title}
								createdAt={doc.createdAt}
								creatorDisplayName={doc.creatorDisplayName}
								creatorId={doc.creatorId}
								comments={doc.comments}
								done={doc.done}
							/>
						)
				)}
			</ul>
		</div>
	);
};

export default Search;
