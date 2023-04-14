import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Carousel from '../Components/Carousel';
import Footer from '../Components/Footer';
import PostUnit from '../Components/PostUnit';
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
	creatorRating?: number;
	creatorCount?: number;
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
		<div className='custom-container'>
			<Carousel />
			<div className='p-7'>
				<div className='mb-4 flex items-center justify-between'>
					<div className='text-lg font-bold leading-none text-gray-900 dark:text-white'>거래글</div>
				</div>
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
									rating={doc.creatorRating}
									count={doc.creatorCount}
									comments={doc.comments}
									done={doc.done}
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
			<Footer />
		</div>
	);
}

export default Home;
