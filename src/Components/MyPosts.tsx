import { useState } from 'react';
import { useGetDataWithQuery } from '../Utilities/useGetDataWithQuery';
import PostUnit from './PostUnit';
import spinner from '../Images/loading.jpg';

const MyPosts = () => {
	const [currentPage, setCurrentPage] = useState<number>(0);
	const { data, isEnd, error } = useGetDataWithQuery(currentPage, 5);

	const nextPage = () => {
		setCurrentPage(currentPage + 1);
	};

	if (error) console.log(error);

	return (
		<div className='mt-5 w-full grow p-3'>
			{data.length === 0 ? (
				<div className='flex h-full w-full items-center justify-center'>
					<img src={spinner} alt='loading' className='h-32' />
				</div>
			) : (
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
};

export default MyPosts;
