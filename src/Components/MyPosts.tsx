import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fbase';
import { doc } from '../Pages/Home';
import PostUnit from './PostUnit';

function MyPosts() {
	const [data, setData] = useState<doc[]>([]);
	const [lastestDoc, setLastestDoc] = useState<any>();
	const [isEnd, setIsEnd] = useState(false);
	const uid = localStorage.getItem('uid');

	let q = query(collection(db, 'Boards'), where('creatorId', '==', uid), orderBy('createdAt', 'desc'), limit(5));

	const getData = async () => {
		if (isEnd) return;

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			setIsEnd(true);
		}

		querySnapshot.forEach((doc) => {
			const docObj = {
				...doc.data(),
				id: doc.id,
			};
			setData((data) => [...data, docObj]);
		});

		setLastestDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
	};

	useEffect(() => {
		getData();
	}, []);

	const nextPage = () => {
		q = query(collection(db, 'Boards'), where('creatorId', '==', uid), orderBy('createdAt', 'desc'), limit(5), startAfter(lastestDoc));
		getData();
	};

	return (
		<div className='mt-5 w-full p-3'>
			{data.length !== 0 && (
				<>
					<div className='mb-4 flex items-center justify-between'>
						<div className='text-md font-bold leading-none text-gray-900 dark:text-white'>작성한 글</div>
					</div>
					<div className='flow-root'>
						<ul className='divide-y divide-gray-200 dark:divide-gray-700'>
							{data.map(
								(doc) =>
									doc.createdAt && (
										<PostUnit
											key={doc.id}
											id={doc.id}
											type={doc.type}
											title={doc.title}
											createdAt={doc.createdAt}
											creatorDisplayName={doc.creatorDisplayName}
											creatorId={doc.creatorId}
											done={doc.done}
											comments={doc.comments}
										/>
									)
							)}
						</ul>

						<div className='mt-5 flex justify-center'>
							{isEnd ? (
								<div className='mt-5 text-sm text-gray-400'>마지막 페이지입니다.</div>
							) : (
								<button
									onClick={nextPage}
									className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
								>
									더 보기
								</button>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default MyPosts;
