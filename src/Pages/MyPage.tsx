import React, { useState } from 'react';
import { auth } from '../fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../Components/EditProfile';

function MyPage() {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const navigate = useNavigate();
	const userInfo = auth.currentUser;
	const profileImage = userInfo?.photoURL;

	const onEditProfileClick = () => {
		setIsEditing((isEditing) => !isEditing);
	};

	const onLogOutClick = () => {
		signOut(auth);
		navigate('/');
	};

	return (
		<>
			{userInfo && (
				<div>
					<button
						onClick={onEditProfileClick}
						className='rounded border border-gray-400 bg-white py-2 px-4 font-semibold text-gray-800 hover:bg-gray-100'
					>
						Edit Profile
					</button>
					<button
						onClick={onLogOutClick}
						className='rounded border border-blue-500  bg-transparent py-2 px-4 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white'
					>
						Logout
					</button>

					{isEditing && <EditProfile setIsEditing={setIsEditing} />}

					<div>displayName: {userInfo.displayName}</div>
					<div>email: {userInfo.email}</div>
					<div>uid: {userInfo.uid}</div>
					{profileImage && <img className='h-10 w-10 rounded-full object-cover' src={profileImage} />}
					{/* <div className='h-10 w-10 rounded-full bg-basic-profile bg-cover'></div> */}
				</div>
			)}
		</>
	);
}

export default MyPage;
