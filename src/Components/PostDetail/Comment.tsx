import { collection, doc, DocumentData, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { db } from '../../fbase';
import CommentUnit from './CommentUnit';

interface CommentProps {
	id: string;
	comments: DocumentData[];
	isCommentsUpdated: boolean;
	setIsCommentsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
	postCreatorId: string;
	done: boolean;
}

const Comment = ({ done, id, comments, isCommentsUpdated, setIsCommentsUpdated, postCreatorId }: CommentProps) => {
	const modalRef = useRef<HTMLButtonElement | null>(null);
	const navigate = useNavigate();
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

		if (!userInfo) {
			alert('댓글 작성은 로그인 후 가능합니다.');
			navigate('/login');
			return;
		}

		if (!id || done) return;

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
			setIsCommentsUpdated(!isCommentsUpdated);
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
						isCommentsUpdated={isCommentsUpdated}
						setIsCommentsUpdated={setIsCommentsUpdated}
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
			)}
		</div>
	);
};

export default Comment;
