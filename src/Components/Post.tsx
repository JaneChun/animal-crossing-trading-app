import React from 'react';
import { elapsedTime } from '../Utilities/elapsedTime';

interface postProps {
	title?: string;
	createdAt: number;
	creatorDisplayName?: string;
}

const Post = ({ title, createdAt, creatorDisplayName }: postProps) => {
	return (
		<li className='py-3 sm:py-4'>
			<div className='flex items-center space-x-4'>
				<div className='flex-shrink-0'>
					<img className='h-8 w-8 rounded-md' src='https://content-resized.nookea.com/s1024/qPlJRRKAhoxDNPQnuFLzb' alt='Neil image' />
				</div>
				<div className='min-w-0 flex-1'>
					<p className='truncate text-base font-medium text-gray-900 dark:text-white'>{title}</p>
					<span className='mr-2 truncate text-sm text-gray-500 dark:text-gray-400'>{creatorDisplayName?.split(' ')[0]}</span>
					{createdAt && <span className='truncate text-sm text-gray-500 dark:text-gray-400'>{elapsedTime(createdAt)}</span>}
				</div>
				<div className='text-center text-sm font-semibold text-gray-900 dark:text-white'>
					<p>댓글</p>
					<p className='text-base'>0</p>
				</div>
			</div>
		</li>
	);
};

export default Post;
