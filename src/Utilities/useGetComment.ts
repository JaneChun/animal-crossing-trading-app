import { DocumentData, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fbase';

function useGetComment(id: string, isCommentsUpdated: boolean) {
	const [comments, setComments] = useState<DocumentData[]>([]);
	const [commentsError, setCommentsError] = useState<Error | null>(null);
	const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

	useEffect(() => {
		setCommentsLoading(true);
		setCommentsError(null);
		setComments([]);

		const getComments = async () => {
			try {
				// const q = query(collection(db, 'Boards', id, 'Comments'), orderBy('createdAt', 'desc'));
				const q = query(collection(db, `Boards/${id}/Comments`), orderBy('createdAt', 'asc'));
				const querySnapshot = await getDocs(q);

				querySnapshot.forEach((doc) => {
					const docObj = {
						...doc.data(),
						commentId: doc.id,
					};
					setComments((comments) => [...comments, docObj]);
				});
			} catch (error: unknown) {
				setCommentsError(error as Error);
			} finally {
				setCommentsLoading(false);
			}
		};

		getComments();
	}, [id, isCommentsUpdated]);

	return { comments, commentsError, commentsLoading };
}

export default useGetComment;
