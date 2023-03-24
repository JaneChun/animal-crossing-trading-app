import React, { useState, useEffect } from 'react';
import { auth, db } from '../fbase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { doc } from '../Pages/Home';
import Post from './Post';

function Posts() {
	const [data, setData] = useState<doc[]>([]);
	const userInfo = auth.currentUser;

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const q = query(collection(db, 'Boards'), where('creatorId', '==', userInfo?.uid), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const docObj = {
				...doc.data(),
				id: doc.id,
			};
			setData((data) => [...data, docObj]);
		});
	};

	return (
		<div className='mt-5 p-3'>
			<div className='mb-4 flex items-center justify-between'>
				<div className='text-md font-bold leading-none text-gray-900 dark:text-white'>작성한 글</div>
			</div>
			<div className='flow-root'>
				<ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
					{data.map(
						(doc) => doc.createdAt && <Post key={doc.id} title={doc.title} createdAt={doc.createdAt} creatorDisplayName={doc.creatorDisplayName} />
					)}
				</ul>
			</div>
		</div>
	);
}

export default Posts;