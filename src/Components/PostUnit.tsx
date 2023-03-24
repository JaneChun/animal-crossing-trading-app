import React from 'react';
import { elapsedTime } from '../Utilities/elapsedTime';
import { useNavigate } from 'react-router-dom';

interface postProps {
	page: string;
	title?: string;
	createdAt: number;
	creatorDisplayName?: string;
	creatorId?: string;
}

const PostUnit = ({ page, title, createdAt, creatorDisplayName, creatorId }: postProps) => {
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
					<p className='truncate text-sm font-semibold text-gray-900 dark:text-white'>{title}</p>
					<span onClick={onCreatorDisplayNameClick} className='mr-2 truncate text-sm text-gray-500 dark:text-gray-400'>
						{creatorDisplayName?.split(' ')[0]}
					</span>
					{createdAt && <span className='truncate text-sm text-gray-500 dark:text-gray-400'>{elapsedTime(createdAt)}</span>}
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
