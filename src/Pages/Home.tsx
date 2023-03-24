import React, { useEffect, useState } from 'react';
import Footer from '../Components/Footer';
import Carousel from '../Components/Carousel';
import { auth, db } from '../fbase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { elapsedTime } from '../Utilities/elapsedTime';

export interface doc {
	id: string;
	title?: string;
	body?: string;
	creatorDisplayName?: string;
	creatorId?: string;
	createdAt?: number;
}

function Home() {
	const navigate = useNavigate();
	const [data, setData] = useState<doc[]>([]);
	const userInfo = auth.currentUser;

	useEffect(() => {
		console.log('useEffect 실행');
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
		<div className='absolute top-[calc(61px)]  min-h-[calc(100vh-61px)] w-screen'>
			<Carousel />
			<div className='mb-[calc(61px)] p-5'>
				{data.map((d) => (
					<ul className='mt-5' key={d.id}>
						<li>제목: {d.title}</li>
						<li>내용: {d.body}</li>
						<li onClick={() => navigate(`/user/${d.creatorId}`)}>작성자: {d.creatorDisplayName}</li>
						{d.createdAt && <li>{elapsedTime(d.createdAt)}</li>}
					</ul>
				))}
			</div>
			{/* <Footer /> */}
		</div>
	);
}

export default Home;
