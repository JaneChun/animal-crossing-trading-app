import React, { useState } from 'react';
import { auth, db } from '../fbase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const NewPost = () => {
	const navigate = useNavigate();
	const [type, setType] = useState<string>('buy');
	const [title, setTitle] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const userInfo = auth.currentUser;

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
			createdAt: Date.now(),
			creatorDisplayName: userInfo?.displayName,
			creatorId: userInfo?.uid,
		};

		if (!userInfo) return;

		if (title === '' || body === '') {
			alert('제목이나 내용이 비어있는지 확인해주세요.');
			return;
		}
		try {
			await setDoc(doc(db, 'Boards', `/${uuidv4()}`), requestData);
			alert('작성헀습니다.');
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
					className='rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500'
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
					className='rounded-r-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500'
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
				id='dropdownSearchButton'
				data-dropdown-toggle='dropdownSearch'
				data-dropdown-placement='bottom'
				className='inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
				type='button'
			>
				아이템 선택
				<svg className='ml-2 h-4 w-4' aria-hidden='true' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'></path>
				</svg>
			</button>

			<div id='dropdownSearch' className='z-10 w-60 rounded-lg bg-white shadow dark:bg-gray-700'>
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
							type='text'
							id='input-group-search'
							className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
							placeholder='Search user'
						/>
					</div>
				</div>
				<ul className='h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownSearchButton'>
					<li>
						<div className='flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							<input
								id='checkbox-item-11'
								type='checkbox'
								value=''
								className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
							/>
							<label htmlFor='checkbox-item-11' className='ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
								Bonnie Green
							</label>
						</div>
					</li>
					<li>
						<div className='flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							<input
								id='checkbox-item-12'
								type='checkbox'
								value=''
								className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
							/>
							<label htmlFor='checkbox-item-12' className='ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
								Jese Leos
							</label>
						</div>
					</li>
					<li>
						<div className='flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							<input
								id='checkbox-item-13'
								type='checkbox'
								value=''
								className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
							/>
							<label htmlFor='checkbox-item-13' className='ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
								Michael Gough
							</label>
						</div>
					</li>
					<li>
						<div className='flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							<input
								id='checkbox-item-14'
								type='checkbox'
								value=''
								className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
							/>
							<label htmlFor='checkbox-item-14' className='ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
								Robert Wall
							</label>
						</div>
					</li>
					<li>
						<div className='flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							<input
								id='checkbox-item-15'
								type='checkbox'
								value=''
								className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
							/>
							<label htmlFor='checkbox-item-15' className='ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
								Joseph Mcfall
							</label>
						</div>
					</li>
					<li>
						<div className='flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							<input
								id='checkbox-item-16'
								type='checkbox'
								value=''
								className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
							/>
							<label htmlFor='checkbox-item-16' className='ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
								Leslie Livingston
							</label>
						</div>
					</li>
					<li>
						<div className='flex items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							<input
								id='checkbox-item-17'
								type='checkbox'
								value=''
								className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700'
							/>
							<label htmlFor='checkbox-item-17' className='ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
								Roberta Casas
							</label>
						</div>
					</li>
				</ul>
				<a
					href='#'
					className='flex items-center rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 text-sm font-medium text-red-600 hover:bg-gray-100 hover:underline dark:border-gray-600 dark:bg-gray-700 dark:text-red-500 dark:hover:bg-gray-600'
				>
					<svg className='mr-1 h-5 w-5' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
						<path d='M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z'></path>
					</svg>
					Delete user
				</a>
			</div>

			<button
				onClick={onSubmit}
				className='mt-5 rounded border border-blue-500 bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white'
			>
				작성
			</button>
		</div>
	);
};

export default NewPost;
