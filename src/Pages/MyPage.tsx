import React, { useContext, useEffect, useRef, useState } from 'react';
import { auth, db } from '../fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../Components/EditProfile';
import MyPosts from '../Components/MyPosts';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

function MyPage() {
	const navigate = useNavigate();
	const { userInfo } = useContext(AuthContext);
	const uid = localStorage.getItem('uid');
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
			<div onClick={handleOutsideClick} className='absolute top-[calc(61px)] h-[calc(100vh-121px)] w-screen overflow-y-auto p-5'>
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
						<img className='mb-3 h-24 w-24 rounded-full object-cover shadow-lg' src={userInfo?.photoURL} />
						<h5 className='mb-1 text-xl font-medium text-gray-900 dark:text-white'>{userInfo.displayName}</h5>
						<span className='mb-1 text-sm text-gray-500 dark:text-gray-400'>🏝 {userInfo.islandName || '섬 이름을 입력해주세요.'}</span>
						<div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
							<span className='text-yellow-400'>
								<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 26 26'>
									<path
										fill='currentColor'
										d='m12 18.275l-4.15 2.5q-.275.175-.575.15t-.525-.2q-.225-.175-.35-.438t-.05-.587l1.1-4.725L3.775 11.8q-.25-.225-.312-.513t.037-.562q.1-.275.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15q.275 0 .537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45q.1.275.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437q-.225.175-.525.2t-.575-.15l-4.15-2.5Z'
									/>
								</svg>
							</span>
							<span>
								{Number(userInfo.rating).toFixed(1)} ({userInfo.count})
							</span>
						</div>
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
						{isEditing && <EditProfile islandName={userInfo.islandName} setIsEditing={setIsEditing} />}
					</div>
				</div>

				{!isEditing && <MyPosts />}
			</div>
		)
	);
}

export default MyPage;
