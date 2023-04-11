import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onSocialClick }) => {
	const navigate = useNavigate();

	return (
		<div
			id='crypto-modal'
			tabIndex='-1'
			aria-hidden='true'
			className='absolute top-0 left-0 right-0 z-50 flex h-[calc(100%-1rem)] w-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full'
		>
			<div className='relative flex w-full max-w-md justify-center md:h-auto'>
				{/* Modal content */}
				<div className='relative rounded-lg bg-white p-3 shadow dark:bg-gray-700'>
					<button
						onClick={() => navigate('/')}
						type='button'
						className='absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white'
						data-modal-hide='crypto-modal'
					>
						<svg aria-hidden='true' className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							></path>
						</svg>
						<span className='sr-only'>Close modal</span>
					</button>
					{/* Modal header */}
					<div className='rounded-t border-b px-6 py-4 dark:border-gray-600'>
						<h3 className='text-base font-semibold text-gray-900 dark:text-white lg:text-xl'>소셜 계정으로 로그인</h3>
					</div>
					{/* Modal body */}
					<div className='p-6'>
						<p className='text-sm font-normal text-gray-500 dark:text-gray-400'>소셜 계정으로 간편하게 로그인하세요.</p>
						<div className='mt-7 space-y-3'>
							<div
								id='google'
								onClick={onSocialClick}
								className='group flex cursor-pointer items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
							>
								<svg className='mr-2 h-5 w-5' xmlns='http://www.w3.org/2000/svg' width='256' height='262' viewBox='0 0 256 262'>
									<path
										fill='#4285F4'
										d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
									/>
									<path
										fill='#34A853'
										d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
									/>
									<path
										fill='#FBBC05'
										d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782'
									/>
									<path
										fill='#EB4335'
										d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
									/>
								</svg>
								Google 로그인
							</div>

							<div
								id='facebook'
								onClick={onSocialClick}
								className='group flex cursor-pointer items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
							>
								<svg className='mr-2 h-5 w-5' xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
									<path
										fill='#1877F2'
										d='M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.307 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.347-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.958 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445'
									/>
									<path
										fill='#FFF'
										d='m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A128.959 128.959 0 0 0 128 256a128.9 128.9 0 0 0 20-1.555V165h29.825'
									/>
								</svg>
								Facebook 로그인
							</div>
						</div>
						{/* <div>
							<a href='#' className='inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400'>
								<svg
									aria-hidden='true'
									className='mr-2 h-3 w-3'
									aria-hidden='true'
									focusable='false'
									data-prefix='far'
									data-icon='question-circle'
									role='img'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 512 512'
								>
									<path
										fill='currentColor'
										d='M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z'
									></path>
								</svg>
								Why do I need to connect with my wallet?
							</a>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
