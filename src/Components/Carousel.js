import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
	const settings = {
		dots: true,
		arrows: true,
		infinite: true,
		speed: 3000,
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
	};

	return (
		<div className=''>
			<Slider {...settings}>
				<div className='h-56'>
					<img
						className='h-full w-full object-cover'
						src='https://animalcrossingworld.com/wp-content/uploads/2020/01/animal-crossing-new-horizons-screenshot-january-1-autumn-scarecrow.jpg'
					/>
				</div>
				<div className='h-56'>
					<img className='h-full  w-full object-cover' src='https://i.pinimg.com/originals/b6/96/42/b69642f9c7b9a77942dfc908fe90493c.jpg' />
				</div>
				<div className='h-56'>
					<img
						className='h-full  w-full object-cover'
						src='https://nintendoeverything.com/wp-content/uploads/sites/1/nggallery/ac-new-horizons/Switch_AnimalCrossingNH_E3_screen_085.jpg'
					/>
				</div>
				<div className='h-56'>
					<img
						className='h-full  w-full object-cover'
						src='https://mypotatogames.com/wp-content/uploads/2020/01/animal_crossing_new_horizons_stary_night.jpg'
					/>
				</div>
				<div className='h-56'>
					<img
						className='h-full  w-full object-cover'
						src='https://64.media.tumblr.com/5c2dd59cc619cb8b1f8ad920996efd99/1a1ce34079a1bbdf-d9/s1280x1920/e9a1011f61fdda81314cbe881cc481cc00e47041.jpg'
					/>
				</div>
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
