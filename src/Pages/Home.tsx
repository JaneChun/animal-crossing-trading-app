import {
	collection,
	DocumentData,
	endBefore,
	getDocs,
	limit,
	limitToLast,
	orderBy,
	query,
	QueryDocumentSnapshot,
	QuerySnapshot,
	startAfter,
	startAt,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../Components/Carousel';
import PostUnit from '../Components/PostUnit';
import { AuthContext } from '../context/AuthContext';
import { db } from '../fbase';

export interface doc {
	id: string;
	type?: string;
	title?: string;
	body?: string;
	creatorDisplayName?: string;
	creatorId?: string;
	createdAt?: number;
	done?: boolean;
	comments?: number;
}

function Home() {
	const [data, setData] = useState<doc[]>([]);
	const [lastestDoc, setLastestDoc] = useState<any>();
	const [isEnd, setIsEnd] = useState(false);

	useEffect(() => {
		getData();
	}, []);

	let q = query(collection(db, 'Boards'), orderBy('createdAt', 'desc'), limit(10));

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

	const nextPage = () => {
		q = query(collection(db, 'Boards'), orderBy('createdAt', 'desc'), limit(10), startAfter(lastestDoc));
		getData();
	};

	return (
		<div className='absolute top-[calc(61px)] h-[calc(100vh-121px)] w-screen overflow-y-auto'>
			<Carousel />
			<div className='p-7'>
				<div className='mb-4 flex items-center justify-between'>
					<div className='text-lg font-bold leading-none text-gray-900 dark:text-white'>거래글</div>
				</div>
				<ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
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
				<div className='flex justify-center'>
					{isEnd ? (
						<div className='mt-5 text-sm text-gray-400'>마지막 페이지입니다.</div>
					) : (
						<button
							onClick={nextPage}
							className='ml-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
						>
							더 보기
						</button>
					)}
				</div>
			</div>
			{/* <Footer /> */}
		</div>
	);
}

export default Home;
