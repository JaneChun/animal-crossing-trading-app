import React from 'react';
import { useParams } from 'react-router-dom';

function PostDetail() {
	const { id } = useParams();
	// firestore에서 해당 id 가진 데이터 불러오기

	return <div className='absolute top-[calc(61px)] min-h-[calc(100vh-61px)] w-screen p-5'>{id} - PostDetail</div>;
}

export default PostDetail;
