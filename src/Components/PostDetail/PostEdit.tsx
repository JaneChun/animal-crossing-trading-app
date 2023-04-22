import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartItem from '../../Components/NewPost/CartItem';
import ItemSelect from '../../Components/NewPost/ItemSelect';
import { AuthContext } from '../../Context/AuthContext';
import { db, storage } from '../../fbase';
import { cartItem } from '../../Pages/NewPost';
import spinner from '../../Images/loading.jpg';
import useGetPostDetail from '../../Utilities/useGetPostDetail';

const PostEdit = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { userInfo } = useContext(AuthContext);
	const { data, error, loading } = useGetPostDetail(state.id);
	const [type, setType] = useState<string>('buy');
	const [title, setTitle] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const [cart, setCart] = useState<cartItem[]>([]);
	const [photoURL, setPhotoURL] = useState<string>('');
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const [newFileURLString, setNewFileURLString] = useState<any>(null);
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);

	if (error) console.log(error);

	useEffect(() => {
		if (data) {
			setType(data.type);
			setTitle(data.title);
			setBody(data.body);
			setCart(data.cart);
			setPhotoURL(data.photoURL);
		}
	}, [data]);

	const typeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		const { name } = e.target as HTMLButtonElement;
		setType(name);
	};

	const titleInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const bodyInputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setBody(e.target.value);
	};

	const fileInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const file = files[0];

			const reader = new FileReader();
			reader.onloadend = () => {
				setNewFileURLString(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const createRef = async (docId: string) => {
		const fileRef: any = ref(storage, `BoardImages/${docId}`);
		await uploadString(fileRef, newFileURLString, 'data_url');
		const profileImageUrl = await getDownloadURL(ref(storage, fileRef));

		return profileImageUrl;
	};

	const deleteFileInput = () => {
		setPhotoURL('');
		setNewFileURLString(null);
	};

	const onCancel = () => {
		navigate(`/post/${state.id}`);
	};

	const onSubmit = async () => {
		if (!userInfo) return;

		if (type === '') {
			alert('거래 종류를 선택해주세요.');
			return;
		}

		if (title === '' || body === '') {
			alert('제목이나 내용이 비어있는지 확인해주세요.');
			return;
		}

		let requestData = {
			type,
			title,
			body,
			cart,
			cartList: cart.map((item) => item.name),
			creatorDisplayName: userInfo?.displayName,
			creatorId: userInfo?.uid,
			done: false,
			photoURL,
		};

		if (newFileURLString) {
			const photoURL = await createRef(state.id);
			requestData = { ...requestData, photoURL };
		}

		try {
			setUploadLoading(true);
			await updateDoc(doc(db, 'Boards', state.id), requestData);
			setUploadLoading(false);
			navigate(`/post/${state.id}`);
		} catch (error) {
			console.log(error);
		} finally {
			setTitle('');
			setBody('');
			setNewFileURLString(null);
		}
	};

	return (
		<div className='custom-container p-5'>
			{loading || uploadLoading ? (
				<div className='flex h-full w-full items-center justify-center'>
					<img src={spinner} alt='loading' className='h-32' />
				</div>
			) : (
				<>
					<div className='inline-flex rounded-md shadow-sm' role='group'>
						{/* Type */}
						<button
							onClick={typeHandler}
							name='buy'
							type='button'
							className={`${
								type === 'buy' ? 'bg-gray-100 text-mint' : 'bg-white text-gray-900'
							} rounded-l-lg border border-gray-200  px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-mint focus:z-10 focus:text-mint focus:ring-2 focus:ring-ring-mint`}
						>
							구해요
						</button>
						<button
							onClick={typeHandler}
							name='sell'
							type='button'
							className={`${
								type === 'sell' ? 'bg-gray-100 text-mint' : 'bg-white text-gray-900'
							} rounded-r-lg border border-gray-200  px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-mint focus:z-10 focus:text-mint focus:ring-2 focus:ring-ring-mint`}
						>
							팔아요
						</button>
					</div>
					{/* Type */}

					{/* Title */}
					<div className='mt-5 mb-6'>
						<label htmlFor='title-input' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
							제목
						</label>
						<input
							value={title}
							onChange={titleInputHandler}
							placeholder='DIY 작업대 레시피 구해요 :)'
							type='text'
							id='title-input'
							className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						/>
					</div>
					{/* Title */}

					{/* Body */}
					<div className='mb-6'>
						<label htmlFor='body-textarea' className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>
							내용
						</label>
						<textarea
							onChange={bodyInputHandler}
							value={body}
							placeholder='2마일에 구매하고 싶어요. 채팅 주세요!'
							id='body-textarea'
							rows={10}
							className='sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						/>
					</div>

					<div className='mb-6'>
						<label htmlFor='file-input' className='mb-2 block text-sm font-medium text-gray-900'>
							사진
						</label>
						{/* photo */}
						<div className='group relative flex w-full items-center justify-center'>
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
							{(photoURL || newFileURLString) && (
								<>
									<img
										className='absolute h-64 w-full cursor-pointer rounded-lg object-cover brightness-100 group-hover:brightness-75'
										alt='thumbnail'
										src={photoURL || newFileURLString}
									/>
									<div
										onClick={deleteFileInput}
										className='invisible absolute z-10 flex w-full cursor-pointer justify-center text-white hover:visible group-hover:visible'
									>
										<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'>
											<mask id='ipSDeleteFour0'>
												<g fill='none' stroke='#fff' strokeLinejoin='round' strokeWidth='4'>
													<path strokeLinecap='round' d='M8 11h32M18 5h12' />
													<path fill='#fff' d='M12 17h24v23a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V17Z' />
												</g>
											</mask>
											<path fill='currentColor' d='M0 0h48v48H0z' mask='url(#ipSDeleteFour0)' />
										</svg>
									</div>
								</>
							)}
						</div>
						{/* photo */}
					</div>

					{/* Body */}

					<ItemSelect isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} cart={cart} setCart={setCart} />

					{/* Cart */}
					<div className='mt-5 flex flex-wrap justify-center'>
						{cart && cart.map((item) => <CartItem key={item.UniqueEntryID} item={item} cart={cart} setCart={setCart} />)}
					</div>
					{/* Cart */}

					<div className='mt-5 mb-[calc(41px)] flex justify-end'>
						<button
							onClick={onSubmit}
							className='mr-2 rounded-lg border border-mint bg-mint py-2 px-4 font-semibold text-white hover:bg-hover-mint focus:ring-4 focus:ring-ring-mint'
						>
							수정
						</button>
						<button
							onClick={onCancel}
							className='rounded-lg border border-mint bg-transparent py-2 px-4 font-semibold text-mint hover:border-transparent hover:bg-mint hover:text-white focus:ring-4 focus:ring-ring-mint'
						>
							취소
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default PostEdit;
