import React, { useState, useRef, SetStateAction } from 'react';
import { auth, db } from '../../fbase';
import { doc, DocumentData, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { elapsedTime } from '../../Utilities/elapsedTime';

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
		} catch (error) {
			console.log(error);
		} finally {
			setCommentInput('');
			setComments([]);
			getComments();
		}
	};

	const editComment = () => {};

	const deleteComment = async (commentId: string) => {
		const confirm = window.confirm('정말로 삭제하겠습니까?');

		if (confirm) {
			const desertRef = doc(collection(db, 'Boards', `/${id}/Comments/${commentId}`));
			try {
				await deleteDoc(desertRef);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleModal = (commentId: string) => {
		if (!isModalOpen) {
			setIsModalOpen(true);
			setClickedComment(commentId);
		} else {
			setIsModalOpen(false);
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
					<li key={comment.commentId} className='relative flex px-4 py-3'>
						<div className='flex-shrink-0'>
							<img
								className='h-11 w-11 rounded-full border'
								src={comment.creatorPhotoURL}
								alt={`${comment.creatorDisplayName.split(' ')[0]}'s profile image`}
							/>
						</div>
						<div className='w-full pl-3'>
							<div className='mb-1.5  text-sm text-gray-500 dark:text-gray-400'>
								<span className='font-semibold text-gray-900 dark:text-white'>{comment?.creatorDisplayName?.split(' ')[0]}</span>

								{/* Dots Button */}
								<button
									ref={modalRef}
									onClick={() => handleModal(comment.commentId)}
									id='dropdownMenuIconButton'
									data-dropdown-toggle='dropdownDots'
									className='absolute top-0 right-0 inline-flex items-center rounded-lg bg-white p-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600'
									type='button'
								>
									<svg className='h-4 w-4' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
										<path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z'></path>
									</svg>
								</button>
								{/* Dots Button */}

								{/* Dropdown */}
								<div
									id='dropdownDots'
									className={`${
										isModalOpen && clickedComment === comment.commentId ? 'visible' : 'hidden'
									} + absolute top-8 right-0 z-10 w-auto divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700`}
								>
									<ul className='py-2 text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownMenuIconButton'>
										<li>
											<button onClick={editComment} className='block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
												수정
											</button>
										</li>
										<li>
											<button
												onClick={() => deleteComment(comment.commentId)}
												className='block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
											>
												삭제
											</button>
										</li>
									</ul>
								</div>
								{/* Dropdown */}

								<div>{comment.comment}</div>
							</div>
							<div className='flex justify-between'>
								<div className='text-xs text-blue-600 dark:text-blue-500'>{elapsedTime(comment.createdAt)}</div>
								<button className='inline-flex items-center rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700'>
									채팅하기
									<svg className='ml-0.5 h-3 w-3' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
										<path
											fillRule='evenodd'
											d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
											clipRule='evenodd'
										></path>
									</svg>
								</button>
							</div>
						</div>
					</li>
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
