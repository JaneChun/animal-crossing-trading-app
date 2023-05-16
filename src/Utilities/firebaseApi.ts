import { DocumentReference, setDoc, updateDoc } from 'firebase/firestore';

export async function setDataToFirestore(ref: DocumentReference, requestData: any) {
	await setDoc(ref, requestData);
}

export async function updateDataToFirestore(ref: DocumentReference, requestData: any) {
	await updateDoc(ref, requestData);
}
