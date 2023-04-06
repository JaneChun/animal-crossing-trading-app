import { updateProfile } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { auth, db, storage } from '../fbase';
// import { v4 as uuidv4 } from 'uuid';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { AuthContext } from '../context/AuthContext';

interface EditProfileProps {
	islandName: string;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile = ({ islandName, setIsEditing }: EditProfileProps) => {
	const { userInfo } = useContext(AuthContext);
	const [displayNameInput, setDisplayNameInput] = useState<string>(userInfo.displayName);
	const [islandNameInput, setIslandNameInput] = useState<string>(islandName);
	const [fileURLString, setFileURLString] = useState<any>(null);

	const displayNameInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayNameInput(e.target.value);
	};

	const islandNameInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIslandNameInput(e.target.value);
	};

	const fileInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const file = files[0];

			const reader = new FileReader();
			reader.onloadend = () => {
				setFileURLString(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const createRef = async () => {
		const fileRef: any = ref(storage, `ProfileImages/${userInfo?.uid}`);
		await uploadString(fileRef, fileURLString, 'data_url');
		const profileImageUrl = await getDownloadURL(ref(storage, fileRef));

		return profileImageUrl;
	};

	// const clearStorage = async () => {
	// 	try {
	// 		const listRef = ref(storage, `ProfileImages/${userInfo?.uid}`);
	// 		const response = await listAll(listRef);
	// 		const paths = response.items.map((item) => item.fullPath);

	// 		paths.forEach((path) => {
	// 			const desertRef = ref(storage, path);
	// 			deleteObject(desertRef);
	// 		});
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const onSubmit = async () => {
		let requestData = {};
		const userInfo = auth.currentUser;

		try {
			if (!userInfo) return;

			// 섬 이름 바뀌었을 때
			if (islandNameInput !== islandName) {
				if (islandNameInput.includes(' ')) {
					alert('섬 이름에 공백 및 특수문자가 있어요.');
					return;
				}
				const docRef = doc(db, 'Users', userInfo.uid);
				await updateDoc(docRef, {
					islandName: islandNameInput,
				});
			}

			// 이름 바뀌었을 때
			if (displayNameInput !== userInfo.displayName) {
				if (displayNameInput.includes(' ')) {
					alert('닉네임에 공백 및 특수문자가 있어요.');
					return;
				}
				requestData = { ...requestData, displayName: displayNameInput };
			}

			// 사진 바뀌었을 때
			if (fileURLString) {
				const photoURL = await createRef();
				requestData = { ...requestData, photoURL };
			}

			if (Object.keys(requestData).length !== 0) {
				await updateProfile(userInfo, requestData);
			}
			setDisplayNameInput('');
			setFileURLString(null);
			setIsEditing(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className='flex items-center'>
				<label htmlFor='displayName' className='mr-3 block text-sm font-medium text-gray-900 '>
					닉네임
				</label>
				<input
					onChange={displayNameInputChangeHandler}
					value={displayNameInput}
					type='text'
					id='displayName'
					className='block min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-ring-mint'
					placeholder='닉네임을 입력해주세요'
				/>
			</div>

			<div className='mt-3 flex items-center'>
				<label htmlFor='islandName' className='mr-2 block text-sm font-medium text-gray-900 '>
					섬 이름
				</label>
				<input
					onChange={islandNameInputChangeHandler}
					value={islandNameInput}
					type='text'
					id='islandName'
					className='block min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-ring-mint'
					placeholder='섬 이름을 입력해주세요'
				/>
			</div>

			<div className='relative flex w-full items-center justify-center p-5'>
				<label
					htmlFor='dropzone-file'
					className='flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
				>
					<div className='flex flex-col items-center justify-center pt-5 pb-6'>
						<svg
							aria-hidden='true'
							className='mb-3 h-10 w-10 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
							></path>
						</svg>
						<p className='mb-2 text-sm text-gray-500'>
							<span className='font-semibold'>Click to upload</span> or drag and drop
						</p>
						<p className='text-xs text-gray-500'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
					</div>
					<input onChange={fileInputHandler} id='dropzone-file' type='file' className='hidden' />
				</label>
				{fileURLString && <img className='absolute h-64 w-full object-cover px-5' src={fileURLString} />}
			</div>

			<div className='flex'>
				<button
					onClick={onSubmit}
					className='mr-2 rounded-lg border border-mint bg-mint py-2 px-4 text-sm font-semibold text-white hover:bg-hover-mint focus:ring-2 focus:ring-ring-mint'
				>
					변경
				</button>
				<button
					onClick={() => setIsEditing(false)}
					className='rounded-lg border border-mint bg-transparent py-2 px-4 text-sm font-semibold text-mint  hover:bg-gray-100 focus:ring-2 focus:ring-gray-300'
				>
					취소
				</button>
			</div>
		</>
	);
};

export default EditProfile;
