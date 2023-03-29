import { deleteDoc, doc, DocumentData, updateDoc, increment } from 'firebase/firestore';
import React, { SetStateAction, useRef, useState } from 'react';
import { db, auth } from '../../fbase';
import { elapsedTime } from '../../Utilities/elapsedTime';

interface CommentUnitProps {
	id: string;
	comment: DocumentData;
	setComments: React.Dispatch<SetStateAction<DocumentData[]>>;
	getComments: () => Promise<void>;
	isModalOpen: boolean;
	setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
	clickedComment: string;
	setClickedComment: React.Dispatch<SetStateAction<string>>;
	modalRef: React.RefObject<HTMLButtonElement>;
	postCreatorId: string;
}

const CommentUnit = ({
	id,
	comment,
	setComments,
	getComments,
	isModalOpen,
	setIsModalOpen,
	clickedComment,
	setClickedComment,
	modalRef,
	postCreatorId,
}: CommentUnitProps) => {
	const commentRef = useRef<HTMLLIElement | null>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [newCommentInput, setNewCommentInput] = useState(comment.comment);
	const userInfo = auth.currentUser;

	const handleModal = (commentId: string) => {
		if (!isModalOpen) {
			setIsModalOpen(true);
			setClickedComment(commentId);
		} else {
			setIsModalOpen(false);
		}
	};

	const updateCommentsLength = async () => {
		const docRef = doc(db, 'Boards', id);
		try {
			await updateDoc(docRef, {
				comments: increment(-1),
			});
		} catch (error) {
			console.log(error);
		}
	};

	const editComment = async () => {
		if (newCommentInput === '') {
			alert('내용이 비어있는지 확인해주세요.');
			return;
		}

		if (!id) return;

		if (comment.comment === newCommentInput) {
			setIsEditing(false);
		}

		const desertRef = doc(db, 'Boards', id, 'Comments', comment.commentId);
		try {
			await updateDoc(desertRef, {
				comment: newCommentInput,
			});
			setComments([]);
			getComments();
		} catch (error) {
			console.log(error);
		}
	};

	const deleteComment = async (commentId: string) => {
		const confirm = window.confirm('정말로 삭제하겠습니까?');

		if (confirm && id) {
			const desertRef = doc(db, 'Boards', id, 'Comments', commentId);
			try {
				await deleteDoc(desertRef);
				updateCommentsLength();
				setComments([]);
				getComments();
			} catch (error) {
				console.log(error);
			}
		}
	};

	const newCommentInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewCommentInput(e.target.value);
	};

	const editCancel = () => {
		const confirm = window.confirm('수정을 취소하겠습니까?');
		if (confirm) {
			setIsEditing(false);
			setNewCommentInput(comment.comment);
		}
	};

	return (
		<li key={comment.commentId} className='relative flex px-4 py-3'>
			{!isEditing ? (
				<>
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
							{postCreatorId === comment.creatorId && (
								<span className='ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
									작성자
								</span>
							)}

							{comment.creatorId === userInfo?.uid && (
								<>
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
										<ul className='text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownMenuIconButton'>
											<li>
												<button
													onClick={() => setIsEditing(true)}
													className='block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
												>
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
								</>
							)}

							<div className='mt-1'>{comment.comment}</div>
						</div>
						<div className='flex justify-between'>
							<div className='pb-3 text-xs text-blue-600 dark:text-blue-500'>{elapsedTime(comment.createdAt)}</div>
							{postCreatorId === userInfo?.uid && postCreatorId !== comment.creatorId && (
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
							)}
						</div>
					</div>
				</>
			) : (
				<div className='flex grow items-center'>
					<textarea
						value={newCommentInput}
						onChange={newCommentInputHandler}
						id='default-textarea'
						className='sm:text-md h-18 block grow resize-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
					/>
					{/* <button
						onClick={editComment}
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
					</button> */}
					<div className='ml-2 flex flex-col'>
						<button
							onClick={editComment}
							type='button'
							className='mb-1 rounded-lg border border-blue-700 bg-blue-700 px-2.5 py-1 text-center text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						>
							수정
						</button>
						<button
							onClick={editCancel}
							type='button'
							className='rounded-lg border border-blue-700 px-2.5 py-1 text-center text-xs font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800'
						>
							취소
						</button>
					</div>
				</div>
			)}
		</li>
	);
};

export default CommentUnit;
