import React from 'react';

function Footer() {
	return (
		<footer className='bg-[#f9fafc] dark:bg-gray-900'>
			<div className='container mx-auto w-full p-4 sm:p-6'>
				<div className='md:flex md:justify-between'>
					<div className='mb-6 md:mb-0'>
						<a href='https://flowbite.com/' className='flex items-center'>
							<img
								src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F120px-Furniture_NH_Inv_Icon.png?alt=media&token=b5e55a18-ddbf-49ce-8477-29ed012bbb2a'
								className='mr-1 h-6'
								alt='Logo'
							/>
							<span className='text-md self-center whitespace-nowrap font-semibold dark:text-white'>모동숲 마켓</span>
						</a>
					</div>
					{/* <div className='grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6'>
						<div>
							<h2 className='mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white'>Resources</h2>
							<ul className='text-gray-600 dark:text-gray-400'>
								<li className='mb-4'>
									<a href='https://flowbite.com/' className='hover:underline'>
										Flowbite
									</a>
								</li>
								<li>
									<a href='https://tailwindcss.com/' className='hover:underline'>
										Tailwind CSS
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h2 className='mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white'>Follow us</h2>
							<ul className='text-gray-600 dark:text-gray-400'>
								<li className='mb-4'>
									<a href='https://github.com/themesberg/flowbite' className='hover:underline '>
										Github
									</a>
								</li>
								<li>
									<a href='https://discord.gg/4eeurUVvTy' className='hover:underline'>
										Discord
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h2 className='mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white'>Legal</h2>
							<ul className='text-gray-600 dark:text-gray-400'>
								<li className='mb-4'>
									<a href='#' className='hover:underline'>
										Privacy Policy
									</a>
								</li>
								<li>
									<a href='#' className='hover:underline'>
										Terms &amp; Conditions
									</a>
								</li>
							</ul>
						</div>
					</div> */}
				</div>
				{/* <hr className='my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8' /> */}
				<div className='sm:flex sm:items-center sm:justify-between'>
					<span className='text-sm text-gray-500 dark:text-gray-400 sm:text-center'>
						© 2023{' '}
						<a href='https://flowbite.com/' className='hover:underline'>
							모동숲 마켓
						</a>
						. All Rights Reserved.
					</span>

					<div className='mt-1 flex'>
						<a href='https://github.com/JaneChun/animal-crossing-trading-app' className='mr-1 text-gray-500 hover:text-gray-900'>
							<svg className='h-5 w-5' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
								<path
									fillRule='evenodd'
									d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
									clipRule='evenodd'
								/>
							</svg>
							<span className='sr-only'>GitHub account</span>
						</a>
						<span className='text-sm text-gray-500 dark:text-gray-400'>개발자 JaneChun</span>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
