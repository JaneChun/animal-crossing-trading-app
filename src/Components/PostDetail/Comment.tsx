import { collection, doc, DocumentData, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { SetStateAction, useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../fbase';
import CommentUnit from './CommentUnit';

interface CommentProps {
	id: string;
	comments: DocumentData[];
	setComments: React.Dispatch<SetStateAction<DocumentData[]>>;
	getComments: () => Promise<void>;
	postCreatorId: string;
	done: boolean;
}

const Comment = ({ done, id, comments, setComments, getComments, postCreatorId }: CommentProps) => {
	const modalRef = useRef<HTMLButtonElement | null>(null);
	const { userInfo } = useContext(AuthContext);
	const [commentInput, setCommentInput] = useState('');
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [clickedComment, setClickedComment] = useState<string>('');

	const commentInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCommentInput(e.target.value);
	};

	const updateCommentsLength = async () => {
		const docRef = doc(db, 'Boards', id);
		try {
			await updateDoc(docRef, {
				comments: increment(1),
			});
		} catch (error) {
			console.log(error);
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!userInfo || !id || done) return;

		const requestData = {
			comment: commentInput,
			createdAt: serverTimestamp(),
			creatorDisplayName: userInfo.displayName,
			creatorIslandName: userInfo.islandName,
			creatorPhotoURL: userInfo.photoURL,
			creatorId: userInfo.uid,
			creatorRating: userInfo.rating,
			creatorCount: userInfo.count,
		};

		if (commentInput === '') {
			alert('내용이 비어있는지 확인해주세요.');
			return;
		}

		try {
			const commentRef = doc(collection(db, 'Boards', id, 'Comments'));
			await setDoc(commentRef, requestData);
			alert('작성했습니다.');
			updateCommentsLength();
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
		<div onClick={handleOutsideClick} id='comments-container' className='z-20 w-full max-w-sm divide-y divide-gray-100 bg-white'>
			<div className='block px-4 py-2 font-medium text-gray-700'>댓글 ({comments.length})</div>
			<ul className='divide-y divide-gray-100'>
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
						postCreatorId={postCreatorId}
					/>
				))}
			</ul>

			{/* Comment Write */}
			{!done && (
				<form onSubmit={onSubmit}>
					<div className='mt-4 w-full rounded-lg border border-gray-200 bg-gray-50'>
						<div className='rounded-t-lg bg-white px-4 py-2'>
							<textarea
								onChange={commentInputHandler}
								value={commentInput}
								id='comment'
								rows={3}
								className='w-full resize-none border-0 bg-white py-2 text-sm text-gray-900 outline-none focus:ring-0'
								placeholder='댓글을 작성하세요.'
								required
							></textarea>
						</div>
						<div className='flex items-center justify-end border-t px-3 py-2'>
							<button
								type='submit'
								className='rounded-lg border border-mint bg-transparent py-1.5 px-3 text-sm font-semibold text-mint hover:border-transparent hover:bg-mint hover:text-white focus:ring-4 focus:ring-ring-mint'
							>
								작성
							</button>
						</div>
					</div>
				</form>

				// <div className='mb-[calc(61px)] flex rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-700'>
				// 	<div className='flex grow items-center'>
				// 		<textarea
				// 			value={commentInput}
				// 			onChange={commentInputHandler}
				// 			placeholder='댓글을 작성하세요.'
				// 			id='default-textarea'
				// 			className='sm:text-md block grow resize-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
				// 		/>
				// 		<button
				// 			onClick={onSubmit}
				// 			type='button'
				// 			className='ml-2 inline-flex items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
				// 		>
				// 			<svg aria-hidden='true' className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
				// 				<path
				// 					fillRule='evenodd'
				// 					d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
				// 					clipRule='evenodd'
				// 				></path>
				// 			</svg>
				// 		</button>
				// 	</div>
				// </div>
			)}
		</div>
	);
};

export default Comment;
