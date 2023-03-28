import { deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
import React, { SetStateAction, useState } from 'react';
import { db } from '../../fbase';
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
}: CommentUnitProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [newCommentInput, setNewCommentInput] = useState('');

	const handleModal = (commentId: string) => {
		if (!isModalOpen) {
			setIsModalOpen(true);
			setClickedComment(commentId);
		} else {
			setIsModalOpen(false);
		}
	};

	const editComment = async (commentId: string) => {
		if (newCommentInput === '') {
			alert('내용이 비어있는지 확인해주세요.');
		}

		if (!id) return;

		const desertRef = doc(db, 'Boards', id, 'Comments', commentId);
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
				setComments([]);
				getComments();
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
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
						<ul className='text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownMenuIconButton'>
							<li>
								<button
									onClick={() => editComment(comment.commentId)}
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
	);
};

export default CommentUnit;
