import React, { useContext, useEffect, useState } from 'react';
import Footer from '../Components/Footer';
import Carousel from '../Components/Carousel';
import { auth, db } from '../fbase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import PostUnit from '../Components/PostUnit';
import { AuthContext } from '../context/AuthContext';

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
	const navigate = useNavigate();
	const [data, setData] = useState<doc[]>([]);
	const { userInfo } = useContext(AuthContext);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		const q = query(collection(db, 'Boards'), orderBy('createdAt', 'desc'));
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
		<div className='absolute top-[calc(61px)] h-[calc(100vh-121px)] w-screen overflow-y-auto'>
			<Carousel />
			<div className='p-7'>
				<div className='mb-4 flex items-center justify-between'>
					<div className='text-lg font-bold leading-none text-gray-900 dark:text-white'>거래글</div>
				</div>
				<div className='flow-root'>
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
				</div>
			</div>
			{/* <Footer /> */}
		</div>
	);
}

export default Home;
