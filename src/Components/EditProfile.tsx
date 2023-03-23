import React, { useState } from 'react';
import { auth } from '../fbase';
import { updateProfile } from 'firebase/auth';

interface EditProfileProps {
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditProfile({ setIsEditing }: EditProfileProps) {
	const [displayNameInput, setDisplayNameInput] = useState<string>('');
	const userInfo = auth.currentUser;

	const onDisplayNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayNameInput(e.target.value);
	};

	const saveChange = async () => {
		if (userInfo && userInfo?.displayName !== displayNameInput) {
			await updateProfile(userInfo, { displayName: displayNameInput });
		}
		setIsEditing(false);
	};

	return (
		<>
			<div>
				<label htmlFor='displayName'>닉네임</label>
				<input
					onChange={onDisplayNameInputChange}
					value={displayNameInput}
					type='text'
					id='displayName'
					className='block min-w-0 flex-1 rounded-none rounded-r-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
					placeholder='닉네임을 입력해주세요'
				/>
			</div>

			<div className='flex w-full items-center justify-center'>
				<label
					htmlFor='dropzone-file'
					className='dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'
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
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
							></path>
						</svg>
						<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
							<span className='font-semibold'>Click to upload</span> or drag and drop
						</p>
						<p className='text-xs text-gray-500 dark:text-gray-400'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
					</div>
					<input id='dropzone-file' type='file' className='hidden' />
				</label>
			</div>

			<button onClick={saveChange} className='rounded bg-gray-300 py-2 px-4 font-bold text-gray-800 hover:bg-gray-400'>
				변경
			</button>
		</>
	);
}

export default EditProfile;
