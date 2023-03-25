import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface item {
	UniqueEntryID: string;
	imageUrl: string;
	name: string;
	color?: string;
}

function Search() {
	const [data, setData] = useState([]);
	const [category, setCategory] = useState('');
	const databaseURL = 'https://animal-crossing-trade-app-default-rtdb.asia-southeast1.firebasedatabase.app';

	useEffect(() => {
		getData();
	}, [category]);

	const getData = async () => {
		const response = await axios.get(`${databaseURL}/items/${category}.json`);
		if (response.status === 200) {
			setData(response.data);
		} else {
			throw new Error(response.statusText);
		}
	};

	const categories = [
		'Houswares',
		'Bags',
		'Rugs',
		'Recipes',
		'Headwear',
		'Floors',
		'Wallmounted',
		'Wallpaper',
		'Tops',
		'Shoes',
		'Accessories',
		'Socks',
		'Food',
		'Umbrellas',
		'DressUp',
		'Music',
		'Miscellaneous',
		'CeilingDecor',
		'Gyroids',
		'Bottoms',
	];

	const selectBoxHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCategory(e.target.value);
	};
	console.log('data', data);
	return (
		<div className='absolute top-[calc(61px)] min-h-[calc(100vh-61px)] w-screen'>
			<select onChange={selectBoxHandler}>
				<option value=''>--카테고리 선택--</option>
				{categories.map((category) => (
					<option key={category} value={category}>
						{category}
					</option>
				))}
			</select>
			<select>
				<option value=''>--아이템 선택--</option>
				{data.length > 0 &&
					data.map((item: item) => (
						<option key={item.UniqueEntryID}>
							{item.name} ({item.color})
						</option>
					))}
			</select>
		</div>
	);
}

export default Search;
