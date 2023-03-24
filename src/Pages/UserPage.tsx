import React from 'react';
import { useParams } from 'react-router-dom';

function UserPage() {
	const { uid } = useParams();

	return <div className='absolute top-[calc(61px)] min-h-[calc(100vh-61px)] w-screen p-5'>{uid}의 유저 페이지</div>;
}

export default UserPage;
