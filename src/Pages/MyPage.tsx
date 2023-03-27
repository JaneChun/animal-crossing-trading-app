import React, { useRef, useState } from 'react';
import { auth } from '../fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../Components/EditProfile';
import MyPosts from '../Components/MyPosts';

function MyPage() {
	const navigate = useNavigate();
	const userInfo = auth.currentUser;
	const profileImage = userInfo?.photoURL;
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const modalRef = useRef<HTMLButtonElement | null>(null);

	const onEditProfileClick = () => {
		setIsEditing((isEditing) => !isEditing);
	};

	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as any;
		if (isModalOpen && !modalRef.current?.contains(target)) {
			setIsModalOpen(false);
		}
	};

	return (
		userInfo && (
			<div onClick={handleOutsideClick} className='absolute top-[calc(61px)] mb-[calc(61px)] min-h-[calc(100vh-61px)] w-screen p-5'>
				<div className='w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800'>
					<div className='relative flex justify-end px-4 pt-4'>
						{/* Dots Button */}
						<button
							ref={modalRef}
							onClick={handleModal}
							id='dropdownButton'
							data-dropdown-toggle='dropdown'
							className='inline-block rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700'
							type='button'
						>
							<span className='sr-only'>Open dropdown</span>
							<svg className='h-6 w-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
								<path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z'></path>
							</svg>
						</button>
						{/* Dots Button */}

						{/* Dropdown */}
						<div
							id='dropdownDots'
							className={`${
								!isModalOpen && 'hidden'
							} + absolute top-14 right-4 z-10 w-auto divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700`}
						>
							<ul className='text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownMenuIconButton'>
								<li>
									<button onClick={onLogOutClick} className='block px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
										로그아웃
									</button>
								</li>
							</ul>
						</div>
						{/* Dropdown */}
					</div>

					<div className='flex flex-col items-center pb-10'>
						{profileImage && (
							<img
								className='mb-3 h-24 w-24 rounded-full object-cover shadow-lg'
								src={profileImage}
								alt={`${userInfo.displayName}'s profile image`}
							/>
						)}
						<h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>{userInfo.displayName?.split(' ')[0]}</h5>
						<span className='text-sm text-gray-500 dark:text-gray-400'>🏝 {userInfo.displayName?.split(' ')[1] || '어떤 섬에 사시나요?'}</span>
						<div className='mt-4 flex space-x-3 md:mt-6'>
							{!isEditing && (
								<button
									onClick={onEditProfileClick}
									className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700'
								>
									프로필 수정
								</button>
							)}
						</div>
						{isEditing && <EditProfile setIsEditing={setIsEditing} />}
					</div>
				</div>

				{!isEditing && <MyPosts />}
			</div>
		)
	);
}

export default MyPage;
