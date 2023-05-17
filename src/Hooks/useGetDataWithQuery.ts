import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../fbase';

export interface doc {
	id: string;
	type?: string;
	title?: string;
	body?: string;
	creatorDisplayName?: string;
	creatorId?: string;
	createdAt?: number;
	done?: boolean;
	comments?: number;
	creatorRating?: number;
	creatorCount?: number;
}

export function useGetDataWithQuery(currentPage: number, count: number) {
	const [data, setData] = useState<doc[]>([]);
	const [lastestDoc, setLastestDoc] = useState<any>();
	const [isEnd, setIsEnd] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, count]);

	const createQuery = (currentPage: number) => {
		if (currentPage === 0) {
			return query(collection(db, 'Boards'), orderBy('createdAt', 'desc'), limit(count));
		} else {
			return query(collection(db, 'Boards'), orderBy('createdAt', 'desc'), limit(count), startAfter(lastestDoc));
		}
	};

	const getData = async () => {
		try {
			if (isEnd) return;

			const q = createQuery(currentPage);

			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				setIsEnd(true);
				return;
			}

			querySnapshot.forEach((doc) => {
				const docObj = {
					...doc.data(),
					id: doc.id,
				};
				setData((data) => [...data, docObj]);
			});

			setLastestDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
		} catch (error: unknown) {
			setError(error as Error);
		}
	};
	return { data, isEnd, error };
}
