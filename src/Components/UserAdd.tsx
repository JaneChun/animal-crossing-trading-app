import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { item, cartItem } from '../Pages/NewPost';

interface UserAddProps {
	setCart: React.Dispatch<React.SetStateAction<cartItem[]>>;
}

const UserAdd = ({ setCart }: UserAddProps) => {
	const [userAddInput, setUserAddInput] = useState<string>('');

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

	return (
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
	);
};

export default UserAdd;
