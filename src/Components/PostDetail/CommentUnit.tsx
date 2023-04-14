import { deleteDoc, doc, DocumentData, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import React, { SetStateAction, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
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
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [newCommentInput, setNewCommentInput] = useState(comment.comment);
	const { userInfo } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);

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

	const editComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (newCommentInput === '') {
			alert('내용이 비어있는지 확인해주세요.');
			return;
		}

		if (!id) return;

		if (comment.comment === newCommentInput) {
			setIsEditing(false);
			return;
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

	const onChatClick = async (comment: DocumentData) => {
		if (!id || !userInfo) return;

		// 이미 존재하는 채팅방인지 확인한다.
		const combinedId = userInfo.uid > comment.creatorId ? userInfo.uid + comment.creatorId : comment.creatorId + userInfo.uid;
		try {
			const response = await getDoc(doc(db, 'Chats', combinedId));
			// 이미 둘이 채팅한 적이 없다면 새로 만든다.
			if (!response.exists()) {
				await setDoc(doc(db, 'Chats', combinedId), {
					messages: [],
					participants: [userInfo.uid, comment.creatorId],
					usersInfo: [
						{
							uid: userInfo.uid,
							displayName: userInfo.displayName,
							islandName: userInfo.islandName,
							photoURL: userInfo.photoURL,
							rating: userInfo.rating,
							count: userInfo.count,
						},
						{
							uid: comment.creatorId,
							displayName: comment.creatorDisplayName,
							islandName: comment.creatorIslandName,
							photoURL: comment.creatorPhotoURL,
							rating: comment.creatorRating,
							count: comment.creatorCount,
						},
					],
				});
			}

			dispatch({
				type: 'CHANGE_USER',
				payload: {
					uid: comment.creatorId,
					displayName: comment.creatorDisplayName,
					islandName: comment.creatorIslandName,
					photoURL: comment.creatorPhotoURL,
					rating: comment.creatorRating,
					count: comment.creatorCount,
				},
			});

			navigate(`/chat/${comment.creatorId}`);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{!isEditing ? (
				<li key={comment.commentId} className='relative flex px-4 py-3'>
					<div className='flex-shrink-0'>
						<img
							className='h-11 w-11 rounded-full border object-cover'
							src={comment.creatorPhotoURL}
							alt={`${comment.creatorDisplayName}'s profile`}
						/>
					</div>

					<div className='w-full pl-3'>
						<div className='mb-1.5  text-sm text-gray-500'>
							<span className='font-semibold text-gray-900'>{comment.creatorDisplayName}</span>
							{postCreatorId === comment.creatorId && (
								<span className='ml-2 rounded bg-lightcoral px-2 py-0.5 text-xs font-medium text-dark-lightcoral'>작성자</span>
							)}

							{comment.creatorId === userInfo?.uid && (
								<>
									{/* Dots Button */}
									<button
										ref={modalRef}
										onClick={() => handleModal(comment.commentId)}
										id='dropdownMenuIconButton'
										data-dropdown-toggle='dropdownDots'
										className='absolute top-0 right-0 inline-flex items-center rounded-lg bg-white p-1 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50'
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
										} + absolute top-8 right-0 z-10 w-auto divide-y divide-gray-100 rounded-lg bg-white shadow`}
									>
										<ul className='text-sm text-gray-700' aria-labelledby='dropdownMenuIconButton'>
											<li>
												<button onClick={() => setIsEditing(true)} className='block px-6 py-2 hover:bg-gray-100'>
													수정
												</button>
											</li>
											<li>
												<button onClick={() => deleteComment(comment.commentId)} className='block px-6 py-2 hover:bg-gray-100'>
													삭제
												</button>
											</li>
										</ul>
									</div>
									{/* Dropdown */}
								</>
							)}

							<div className='mt-1 whitespace-pre-wrap'>{comment.comment}</div>
						</div>
						<div className='flex justify-between'>
							<div className='pb-3 text-xs text-hover-mint'>{elapsedTime(comment.createdAt.toDate())}</div>
							{postCreatorId === userInfo?.uid && postCreatorId !== comment.creatorId && (
								<button
									onClick={() => onChatClick(comment)}
									className='inline-flex items-center rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-mint focus:z-10 focus:text-mint focus:outline-none focus:ring-4 focus:ring-gray-200'
								>
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
				</li>
			) : (
				<form className='w-full' onSubmit={editComment}>
					<div className='mt-4 w-full rounded-lg border border-gray-200 bg-gray-50'>
						<div className='rounded-t-lg bg-white px-4 py-2'>
							<textarea
								onChange={newCommentInputHandler}
								value={newCommentInput}
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
								className='mr-2 rounded-lg border border-mint bg-mint py-1.5 px-3 text-sm font-semibold text-white hover:bg-hover-mint focus:ring-2 focus:ring-ring-mint'
							>
								수정
							</button>
							<button
								onClick={editCancel}
								className='rounded-lg border border-mint bg-transparent py-1.5 px-3 text-sm font-semibold text-mint  hover:bg-gray-100 focus:ring-2 focus:ring-gray-300'
							>
								취소
							</button>
						</div>
					</div>
				</form>
			)}
		</>
	);
};

export default CommentUnit;
