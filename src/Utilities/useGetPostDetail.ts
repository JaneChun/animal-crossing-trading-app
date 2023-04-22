import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fbase';

function useGetPostDetail(id: string, isUpdated?: boolean) {
	const [data, setData] = useState<DocumentData>({});
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setLoading(true);
		setError(null);
		setData({});

		const getData = async () => {
			try {
				const docRef = doc(db, 'Boards', id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const docData = docSnap.data();
					setData({ ...docData, id });
				}
			} catch (error: unknown) {
				setError(error as Error);
			} finally {
				setLoading(false);
			}
		};

		getData();
	}, [id, isUpdated]);

	return { data, error, loading };
}

export default useGetPostDetail;
