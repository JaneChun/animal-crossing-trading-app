import { useNavigate } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();

	return (
		<header className='absolute top-0 z-20 h-[61px] w-full border-b border-gray-200 bg-lightgray px-2 py-2.5 sm:px-4'>
			<div onClick={() => navigate('/')} className='flex cursor-pointer items-center'>
				<img
					src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F120px-Furniture_NH_Inv_Icon.png?alt=media&token=b5e55a18-ddbf-49ce-8477-29ed012bbb2a'
					className='mr-1 h-9'
					alt='Logo'
				/>
				<span className='self-center whitespace-nowrap text-xl font-semibold'>모동숲 마켓</span>
			</div>

			{/* <div className='flex md:order-2'>
					<button
						data-collapse-toggle='navbar-sticky'
						type='button'
						className='inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
						aria-controls='navbar-sticky'
						aria-expanded='false'
					>
						<span className='sr-only'>Open main menu</span>
						<svg className='h-6 w-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
							<path
								fillRule='evenodd'
								d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
								clipRule='evenodd'
							></path>
						</svg>
					</button>
				</div> */}
		</header>
	);
};

export default Header;
