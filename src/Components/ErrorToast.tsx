import { useEffect, useState } from 'react';

interface ErrorToastProps {
	error: string | null;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ErrorToast = ({ error, setError }: ErrorToastProps) => {
	const [isToastVisible, setIsToastVisible] = useState<boolean>(false);

	useEffect(() => {
		setIsToastVisible(true);
	}, [error]);

	const closeToast = () => {
		setIsToastVisible(false);
		setError(null);
	};

	return (
		<div className='flex justify-center'>
			<div
				onClick={() => setError(null)}
				className={`${
					isToastVisible ? 'top-3' : '-top-20'
				}  + fixed z-50 w-full max-w-xs rounded-md border bg-white shadow-lg transition-all duration-500 ease-in-out dark:border-gray-700 dark:bg-gray-800`}
				role='alert'
			>
				<div className='flex p-4'>
					{/* icon */}
					<span className='flex-shrink-0 text-green-500'>
						<svg
							className='mt-0.5 h-4 w-4 text-red-500'
							xmlns='http://www.w3.org/2000/svg'
							width='16'
							height='16'
							fill='currentColor'
							viewBox='0 0 16 16'
						>
							<path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
						</svg>
					</span>

					{/* message */}
					<div className='ml-3'>
						<p className='text-sm text-gray-700 dark:text-gray-400'>{error}</p>
					</div>

					{/* button */}
					<button
						onClick={closeToast}
						type='button'
						className='-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white'
						data-dismiss-target='#toast-default'
						aria-label='Close'
					>
						<span className='sr-only'>Close</span>
						<svg aria-hidden='true' className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
							<path
								fillRule='evenodd'
								d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
								clipRule='evenodd'
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ErrorToast;
