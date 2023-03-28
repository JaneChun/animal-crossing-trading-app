import { collection, doc, DocumentData, setDoc } from 'firebase/firestore';
import React, { SetStateAction, useRef, useState } from 'react';
import { auth, db } from '../../fbase';
import CommentUnit from './CommentUnit';

interface CommentProps {
	id: string;
	comments: DocumentData[];
	setComments: React.Dispatch<SetStateAction<DocumentData[]>>;
	getComments: () => Promise<void>;
}

const Comment = ({ id, comments, setComments, getComments }: CommentProps) => {
	const modalRef = useRef<HTMLButtonElement | null>(null);
	const userInfo = auth.currentUser;
	const profileImage = userInfo?.photoURL;
	const [commentInput, setCommentInput] = useState('');
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [clickedComment, setClickedComment] = useState<string>('');

	const commentInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCommentInput(e.target.value);
	};

	const onSubmit = async () => {
		const requestData = {
			comment: commentInput,
			createdAt: Date.now(),
			creatorDisplayName: userInfo?.displayName,
			creatorPhotoURL: userInfo?.photoURL,
			creatorId: userInfo?.uid,
		};

		if (!userInfo) return;

		if (commentInput === '') {
			alert('내용이 비어있는지 확인해주세요.');
			return;
		}

		try {
			if (!id) return;
			const commentRef = doc(collection(db, 'Boards', id, 'Comments'));
			await setDoc(commentRef, requestData);
			alert('작성했습니다.');
			setComments([]);
			getComments();
		} catch (error) {
			console.log(error);
		} finally {
			setCommentInput('');
		}
	};

	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as any;
		if (isModalOpen && !modalRef.current?.contains(target)) {
			setIsModalOpen(false);
		}
	};

	return (
		<div
			onClick={handleOutsideClick}
			id='comments-container'
			className='z-20 w-full max-w-sm divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800'
		>
			<div className='block px-4 py-2 font-medium text-gray-700 dark:bg-gray-800 dark:text-white'>댓글 ({comments.length})</div>
			<ul className='divide-y divide-gray-100 dark:divide-gray-700'>
				{comments.map((comment) => (
					<CommentUnit
						key={comment.commentId}
						id={id}
						comment={comment}
						getComments={getComments}
						setComments={setComments}
						isModalOpen={isModalOpen}
						setIsModalOpen={setIsModalOpen}
						clickedComment={clickedComment}
						setClickedComment={setClickedComment}
						modalRef={modalRef}
					/>
				))}
			</ul>

			{/* Comment Write */}
			<div className='mb-[calc(61px)] flex rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-700'>
				<div className='flex flex-col items-center justify-center'>
					{profileImage && <img className='h-11 w-11 rounded-full border' src={profileImage} alt='Robert image' />}
					{/* <div className='mt-1 text-sm font-semibold text-gray-900 dark:text-white'>{userInfo?.displayName?.split(' ')[0]}</div> */}
				</div>
				<div className='flex grow items-center'>
					<textarea
						value={commentInput}
						onChange={commentInputHandler}
						placeholder='일괄 판매합니다. 채팅 주세요!'
						id='default-textarea'
						className='sm:text-md ml-2 block grow resize-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
					/>
					<button
						onClick={onSubmit}
						type='button'
						className='ml-2 inline-flex items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
					>
						<svg aria-hidden='true' className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
							<path
								fillRule='evenodd'
								d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
								clipRule='evenodd'
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Comment;
