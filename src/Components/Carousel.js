import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
	const settings = {
		dots: true,
		arrows: true,
		infinite: true,
		speed: 800,
		autoplay: true,
		autoplaySpeed: 7000,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
	};

	return (
		<div className=''>
			<Slider {...settings}>
				<div className='h-52'>
					<img
						className='h-full w-full object-cover'
						alt='carousel1'
						src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F%E1%84%83%E1%85%A9%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%87%81_20.11.13.%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%20PPT.001.png?alt=media&token=c0164755-e01f-4b63-966e-7a8403f30650'
					/>
				</div>
				<div className='h-52'>
					<img
						className='h-full  w-full object-cover'
						alt='carousel2'
						src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F%E1%84%83%E1%85%A9%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%87%81_20.11.13.%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%20PPT.002.png?alt=media&token=de299d58-8dff-4a64-ab03-32e88d01f79d'
					/>
				</div>
				<div className='h-52'>
					<img
						className='h-full  w-full object-cover'
						alt='carousel3'
						src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F%E1%84%83%E1%85%A9%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%87%81_20.11.13.%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%20PPT.003.png?alt=media&token=83906f6c-3d41-4261-8b16-1b8e3d1d1c50'
					/>
				</div>
				{/* <div className='h-52'>
					<img
						className='h-full  w-full object-cover'
						src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F%E1%84%83%E1%85%A9%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%87%81_20.11.13.%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%20PPT2.001.png?alt=media&token=8bf8ed6a-4691-434e-880b-327669e78c59'
					/>
				</div>
				<div className='h-52'>
					<img
						className='h-full  w-full object-cover'
						src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F%E1%84%83%E1%85%A9%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%87%81_20.11.13.%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%20PPT2.002.png?alt=media&token=34009c82-05d6-49c7-9273-eec3ee57a137'
					/>
				</div>
				<div className='h-52'>
					<img
						className='h-full  w-full object-cover'
						src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F%E1%84%83%E1%85%A9%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%87%81_20.11.13.%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%20PPT2.003.png?alt=media&token=2c955f1a-2618-4f86-be37-a12e342ca3d0'
					/>
				</div>
				<div className='h-52'>
					<img
						className='h-full  w-full object-cover'
						src='https://firebasestorage.googleapis.com/v0/b/animal-crossing-trade-app.appspot.com/o/Src%2F%E1%84%83%E1%85%A9%E1%86%BC%E1%84%86%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B4%E1%84%89%E1%85%AE%E1%87%81_20.11.13.%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%20PPT2.004.png?alt=media&token=f609a6ca-0273-4849-ae9d-83ce42dc2bab'
					/>
				</div> */}
			</Slider>
		</div>
	);
};

export default Carousel;

const NextArrow = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			type='button'
			className='group absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none'
			data-carousel-next
		>
			<span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10'>
				<svg
					aria-hidden='true'
					className='h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7'></path>
				</svg>
				<span className='sr-only'>Next</span>
			</span>
		</button>
	);
};

const PrevArrow = ({ onClick }) => {
	return (
		<button
			onClick={onClick}
			type='button'
			className='group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none'
			data-carousel-prev
		>
			<span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10'>
				<svg
					aria-hidden='true'
					className='h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7'></path>
				</svg>
				<span className='sr-only'>Previous</span>
			</span>
		</button>
	);
};
