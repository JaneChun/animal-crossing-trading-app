import { useNavigate } from 'react-router-dom';
import { elapsedTime } from '../Utilities/elapsedTime';

interface postProps {
	id: string;
	page: string;
	type?: string;
	title?: string;
	createdAt: any;
	creatorDisplayName?: string;
	creatorId?: string;
	comments?: number;
	done?: boolean;
}

const PostUnit = ({ id, page, type, title, createdAt, creatorDisplayName, creatorId, comments, done }: postProps) => {
	const navigate = useNavigate();

	const onCreatorDisplayNameClick = () => {
		if (page === 'Home') {
			navigate(`user/${creatorId}`);
		}
	};

	return (
		<li className='py-3.5 sm:py-4'>
			<div className='flex items-center space-x-4'>
				<div className='flex-shrink-0'>
					<img className='h-8 w-8 rounded-md' src='https://content-resized.nookea.com/s1024/qPlJRRKAhoxDNPQnuFLzb' alt='Neil image' />
				</div>
				<div className='min-w-0 flex-1'>
					<p onClick={() => navigate(`/post/${id}`)} className='text-md cursor-pointer truncate py-0.5 font-semibold text-gray-900'>
						{done === true ? (
							<span className='mr-2 rounded-sm border border-gray-200 bg-white py-0.5 px-1 text-xs font-medium text-gray-800'>거래 완료</span>
						) : type === 'sell' ? (
							<span className='mr-2 rounded-sm border border-skyblue bg-skyblue py-0.5 px-1 text-xs font-medium text-dark-skyblue'>팔아요</span>
						) : (
							<span className='mr-2 rounded-sm bg-lightgreen px-1 py-0.5 text-center text-xs font-medium text-dark-lightgreen'>구해요</span>
						)}
						<span className='text-gray-900'>{title}</span>
					</p>
					<p>
						<span onClick={onCreatorDisplayNameClick} className='mr-2 truncate text-sm text-gray-500'>
							{creatorDisplayName?.split(' ')[0]}
						</span>
						{createdAt && <span className='truncate text-xs text-gray-500'>{elapsedTime(createdAt.toDate())}</span>}
					</p>
				</div>
				<div className='text-center font-semibold text-gray-900'>
					<p className='text-xs'>댓글</p>
					<p className='text-base'>{comments}</p>
				</div>
			</div>
		</li>
	);
};

export default PostUnit;
