import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Nav() {
	const navigate = useNavigate();
	const { userInfo } = useContext(AuthContext);

	return (
		// <nav>
		// 	<Link to='/'>Home</Link>
		// 	{isLoggedIn ? <Link to='/mypage'>MyPage</Link> : <Link to='/login'>Login</Link>}
		// </nav>
		<div className='fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'>
			{/* <div className='w-full'>
				<div className='mx-auto my-2 grid max-w-xs grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-600' role='group'>
					<button
						type='button'
						className='rounded-lg px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'
					>
						New
					</button>
					<button type='button' className='rounded-lg bg-gray-900 px-5 py-1.5 text-xs font-medium text-white dark:bg-gray-300 dark:text-gray-900'>
						Buy
					</button>
					<button
						type='button'
						className='rounded-lg px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700'
					>
						Sell
					</button>
				</div>
			</div> */}
			<div className='mx-auto grid h-full max-w-lg grid-cols-5'>
				<button
					onClick={() => navigate('/')}
					data-tooltip-target='tooltip-home'
					type='button'
					className='group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800'
				>
					<svg
						className='mb-1 h-6 w-6 text-gray-600 group-hover:text-mint dark:text-gray-400 dark:group-hover:text-blue-500'
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'
						aria-hidden='true'
					>
						<path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'></path>
					</svg>
					<span className='sr-only'>Home</span>
				</button>
				<div
					id='tooltip-home'
					role='tooltip'
					className='tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700'
				>
					Home
					<div className='tooltip-arrow' data-popper-arrow></div>
				</div>
				<button
					onClick={() => navigate('/chat')}
					data-tooltip-target='tooltip-chat'
					type='button'
					className='group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800'
				>
					<svg
						className='mb-1 h-6 w-6 text-gray-600 group-hover:text-mint dark:text-gray-400 dark:group-hover:text-blue-500'
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
					>
						<path
							fill='currentColor'
							d='M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8Z'
						/>
					</svg>
					<span className='sr-only'>Chat</span>
				</button>
				<div
					id='tooltip-chat'
					role='tooltip'
					className='tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700'
				>
					Chat
					<div className='tooltip-arrow' data-popper-arrow></div>
				</div>
				<button
					onClick={() => navigate('/newpost')}
					data-tooltip-target='tooltip-post'
					type='button'
					className='group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800'
				>
					<svg
						className='mb-1 h-6 w-6 text-gray-600 group-hover:text-mint dark:text-gray-400 dark:group-hover:text-blue-500'
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'
						aria-hidden='true'
					>
						<path
							clipRule='evenodd'
							fillRule='evenodd'
							d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
						></path>
					</svg>
					<span className='sr-only'>New post</span>
				</button>
				<div
					id='tooltip-post'
					role='tooltip'
					className='tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700'
				>
					New post
					<div className='tooltip-arrow' data-popper-arrow></div>
				</div>
				<button
					onClick={() => navigate('/search')}
					data-tooltip-target='tooltip-search'
					type='button'
					className='group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800'
				>
					<svg
						className='mb-1 h-6 w-6 text-gray-600 group-hover:text-mint dark:text-gray-400 dark:group-hover:text-blue-500'
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'
						aria-hidden='true'
					>
						<path
							clipRule='evenodd'
							fillRule='evenodd'
							d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
						></path>
					</svg>
					<span className='sr-only'>Search</span>
				</button>
				<div
					id='tooltip-search'
					role='tooltip'
					className='tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700'
				>
					Search
					<div className='tooltip-arrow' data-popper-arrow></div>
				</div>
				{userInfo ? (
					<>
						<button
							onClick={() => navigate('/mypage')}
							data-tooltip-target='tooltip-mypage'
							type='button'
							className='group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800'
						>
							<svg
								className='mb-1 h-6 w-6 text-gray-600 group-hover:text-mint dark:text-gray-400 dark:group-hover:text-blue-500'
								fill='currentColor'
								viewBox='0 0 20 20'
								xmlns='http://www.w3.org/2000/svg'
								aria-hidden='true'
							>
								<path
									clipRule='evenodd'
									fillRule='evenodd'
									d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
								></path>
							</svg>
							<span className='sr-only'>My Page</span>
						</button>
						<div
							id='tooltip-mypage'
							role='tooltip'
							className='tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700'
						>
							My Page
							<div className='tooltip-arrow' data-popper-arrow></div>
						</div>
					</>
				) : (
					<>
						<button
							onClick={() => navigate('/login')}
							data-tooltip-target='tooltip-login'
							type='button'
							className='group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800'
						>
							<svg
								className='mb-1 h-6 w-6 text-gray-600 group-hover:text-mint dark:text-gray-400 dark:group-hover:text-blue-500'
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
							>
								<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
									<path d='M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2' />
									<path d='M20 12H7l3-3m0 6l-3-3' />
								</g>
							</svg>
							<span className='sr-only'>Login</span>
						</button>
						<div
							id='tooltip-login'
							role='tooltip'
							className='tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700'
						>
							My Page
							<div className='tooltip-arrow' data-popper-arrow></div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default Nav;
