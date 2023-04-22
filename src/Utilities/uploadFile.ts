import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../fbase';

export const uploadFile = async (fileURLString: string, directory: string, docId: string) => {
	const fileRef = ref(storage, `${directory}/${docId}`); // ref 생성
	await uploadString(fileRef, fileURLString, 'data_url'); // storage에 업로드
	const photoURL = await getDownloadURL(fileRef); // url 다운로드

	return photoURL;
};
