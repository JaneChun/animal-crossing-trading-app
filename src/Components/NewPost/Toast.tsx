import { useEffect, useState } from 'react';

interface ToastProps {
	item: string | null;
}

const Toast = ({ item }: ToastProps) => {
	const [isToastVisible, setIsToastVisible] = useState(false);

	useEffect(() => {
		if (item) {
			setIsToastVisible(true);
			setTimeout(() => {
				setIsToastVisible(false);
			}, 1000);
		}
	}, [item]);

	return (
		<div
			className={`${
				isToastVisible ? 'top-3' : '-top-20'
			}  + fixed z-50 w-full max-w-xs rounded-md border bg-white shadow-lg transition-all duration-500 ease-in-out dark:border-gray-700 dark:bg-gray-800`}
			role='alert'
		>
			<div className='flex p-4'>
				<span className='flex-shrink-0 text-green-500'>
					<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
						<path
							fill='currentColor'
							d='m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z'
						/>
					</svg>
				</span>
				<div className='ml-3'>
					<p className='text-sm text-gray-700 dark:text-gray-400'>{item}이(가) 추가되었어요.</p>
				</div>
			</div>
		</div>
	);
};

export default Toast;
