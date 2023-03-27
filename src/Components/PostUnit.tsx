import React from 'react';
import { elapsedTime } from '../Utilities/elapsedTime';
import { useNavigate } from 'react-router-dom';

interface postProps {
	id: string;
	page: string;
	type?: string;
	title?: string;
	createdAt: number;
	creatorDisplayName?: string;
	creatorId?: string;
}

const PostUnit = ({ id, page, type, title, createdAt, creatorDisplayName, creatorId }: postProps) => {
	const navigate = useNavigate();

	const onCreatorDisplayNameClick = () => {
		if (page === 'Home') {
			navigate(`user/${creatorId}`);
		}
	};

	return (
		<li className='py-3 sm:py-4'>
			<div className='flex items-center space-x-4'>
				<div className='flex-shrink-0'>
					<img className='h-8 w-8 rounded-md' src='https://content-resized.nookea.com/s1024/qPlJRRKAhoxDNPQnuFLzb' alt='Neil image' />
				</div>
				<div className='min-w-0 flex-1'>
					<p onClick={() => navigate(`/post/${id}`)} className='text-md cursor-pointer truncate font-semibold text-gray-900 dark:text-white'>
						{type === 'sell' ? (
							<span className='mr-2 rounded-sm border border-blue-100 bg-blue-100 py-0.5 px-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
								{/* 거래 완료 - <span className='mr-2 rounded-sm border border-gray-200 bg-white py-0.5 px-1 text-xs font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'> */}
								팔아요
							</span>
						) : (
							<span className='mr-2 rounded-sm bg-blue-700 px-1 py-0.5 text-center text-xs font-medium text-white  dark:bg-blue-600'>구해요</span>
						)}
						<span>{title}</span>
					</p>
					<p>
						<span onClick={onCreatorDisplayNameClick} className='mr-2 truncate text-sm text-gray-500 dark:text-gray-400'>
							{creatorDisplayName?.split(' ')[0]}
						</span>
						{createdAt && <span className='truncate text-sm text-gray-500 dark:text-gray-400'>{elapsedTime(createdAt)}</span>}
					</p>
				</div>
				<div className='text-center font-semibold text-gray-900 dark:text-white'>
					<p className='text-xs'>댓글</p>
					<p className='text-base'>0</p>
				</div>
			</div>
		</li>
	);
};

export default PostUnit;
