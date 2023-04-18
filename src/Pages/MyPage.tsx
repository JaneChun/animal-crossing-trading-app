import { doc, updateDoc } from '@firebase/firestore';
import { deleteUser, signOut } from 'firebase/auth';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../Components/EditProfile';
import MyPosts from '../Components/MyPosts';
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../fbase';

function MyPage() {
	const navigate = useNavigate();
	const { userInfo } = useContext(AuthContext);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const modalRef = useRef<HTMLButtonElement | null>(null);

	const onEditProfileClick = () => {
		setIsEditing((isEditing) => !isEditing);
	};

	const onLogOutClick = () => {
		signOut(auth);
		localStorage.clear();
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

	const onDeleteAccountClick = async () => {
		const userInfo = auth.currentUser;

		let answer = prompt('정말로 탈퇴하겠습니까? 맞으시면 "탈퇴합니다"라고 입력해주세요.');

		if (answer === '탈퇴합니다') {
			try {
				if (!userInfo) return;
				const docRef = doc(db, 'Users', userInfo.uid);

				await updateDoc(docRef, {
					isDeletedAccount: true,
				});

				await deleteUser(userInfo).then(() => {
					alert('탈퇴되었습니다.');
					navigate('/');
				});
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div onClick={handleOutsideClick} className='custom-container flex flex-col items-center p-5'>
			{userInfo.displayName && (
				<div className='w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow'>
					<div className='relative flex justify-end px-4 pt-4'>
						{/* Dots Button */}
						<button
							ref={modalRef}
							onClick={handleModal}
							id='dropdownButton'
							data-dropdown-toggle='dropdown'
							className='inline-block rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
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
							className={`${!isModalOpen && 'hidden'} + absolute top-14 right-4 z-10 w-auto divide-y divide-gray-100 rounded-lg bg-white shadow`}
						>
							<ul className='text-sm text-gray-700' aria-labelledby='dropdownMenuIconButton'>
								<li>
									<button onClick={onLogOutClick} className='block px-6 py-2 hover:bg-gray-100 '>
										로그아웃
									</button>
								</li>
								<li>
									<button onClick={onDeleteAccountClick} className='block px-6 py-2 hover:bg-gray-100 '>
										회원 탈퇴
									</button>
								</li>
							</ul>
						</div>
						{/* Dropdown */}
					</div>

					<div className='flex flex-col items-center pb-10'>
						<img className='mb-3 h-24 w-24 rounded-full object-cover shadow-lg' alt='my profile' src={userInfo?.photoURL} />
						<h5 className='mb-1 text-xl font-medium text-gray-900'>{userInfo.displayName}</h5>
						<div className='mb-1 flex items-end text-sm text-gray-500'>
							<img
								className='mr-0.5 h-5 w-5'
								alt='island icon'
								src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2FCoconut_Tree_NH_Inv_Icon.png?alt=media&token=cd997010-694e-49b0-9390-483772cdad8a'
							/>
							<span>{userInfo.islandName || '섬 이름을 입력해주세요.'}</span>
						</div>
						<div className='flex items-center text-sm text-gray-500'>
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
									className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
								>
									프로필 수정
								</button>
							)}
						</div>
						{isEditing && <EditProfile islandName={userInfo.islandName} setIsEditing={setIsEditing} />}
					</div>
				</div>
			)}

			{!isEditing && <MyPosts />}
		</div>
	);
}

export default MyPage;
