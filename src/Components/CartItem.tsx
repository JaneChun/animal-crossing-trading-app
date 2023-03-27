import React, { useState, useEffect } from 'react';
import { cartItem } from '../Pages/NewPost';
import MilesTicket from '../Images/MilesTicket.png';

interface CartItemProps {
	item: cartItem;
	cart: cartItem[];
	setCart: React.Dispatch<React.SetStateAction<cartItem[]>>;
}

function CartItem({ item, cart, setCart }: CartItemProps) {
	const [quantityInput, setQuantityInput] = useState<number>(1);
	const [milesTicketInput, setMilesTicketInput] = useState<number>(1);

	useEffect(() => {
		item.quantity = quantityInput;
		item.price = milesTicketInput;

		if (item.quantity === 0) {
			deleteItemFromCart();
		}
	}, [quantityInput, milesTicketInput]);

	const deleteItemFromCart = () => {
		setCart(cart.filter((cartItem) => cartItem.UniqueEntryID !== item.UniqueEntryID));
	};

	const onQuantityDecrement = () => {
		setQuantityInput((quantityInput) => quantityInput - 1);
	};

	const onQuantityIncrement = () => {
		setQuantityInput((quantityInput) => quantityInput + 1);
	};

	const onMilesTicketDecrement = () => {
		if (milesTicketInput === 0) return;
		setMilesTicketInput((milesTicketInput) => milesTicketInput - 1);
	};

	const onMilesTicketIncrement = () => {
		setMilesTicketInput((milesTicketInput) => milesTicketInput + 1);
	};

	return (
		<div className='my-3'>
			{/* Image Card */}
			<div className='relative m-3 block h-28 w-28 rounded-lg border border-gray-200 bg-white p-3 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
				<button
					onClick={deleteItemFromCart}
					type='button'
					className='absolute top-0 right-0 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
					data-modal-hide='defaultModal'
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

				<img className='mx-auto h-14 w-14' src={item.imageUrl} />
				<p className='truncate whitespace-nowrap text-center text-xs text-gray-700 dark:text-gray-400'>{item.name}</p>
				<p className='mt-1 truncate whitespace-nowrap text-center text-xs text-gray-400 dark:text-gray-400'>{item.color && `${item.color}`}</p>
			</div>
			{/* Image Card */}

			{/* Quantity Counter */}
			<div className='custom-number-input mx-auto h-10 w-20'>
				<div className='relative mt-1 flex h-8 w-full flex-row rounded-lg border bg-transparent'>
					<button
						onClick={onQuantityDecrement}
						data-action='decrement'
						className='flex w-7 cursor-pointer items-center justify-center rounded-br text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus:outline-none '
					>
						<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
							<path fill='currentColor' d='M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z' />
						</svg>
					</button>

					<div className='flex w-7 items-center'>
						<input
							readOnly
							type='number'
							className='outlineNone focus:outlineNone w-full cursor-default  bg-transparent text-center text-sm  font-semibold  text-gray-700 hover:text-black  focus:text-black md:text-base'
							name='custom-input-number'
							value={quantityInput.toString()}
						/>
					</div>

					<button
						onClick={onQuantityIncrement}
						data-action='increment'
						className='flex w-7 cursor-pointer items-center justify-center rounded-tr text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus:outline-none'
					>
						<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
							<path fill='currentColor' d='M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z' />
						</svg>
					</button>
				</div>
			</div>
			{/* Quantity Counter */}

			{/* Miles Ticket Counter */}
			<div className='custom-number-input mx-auto h-10 w-20'>
				<div className='relative mt-1 flex h-8 w-full flex-row rounded-lg border bg-transparent'>
					<div className='flex w-full items-center'>
						<img className='ml-1 h-6 w-6 ' src={MilesTicket} />
						<input
							readOnly
							type='number'
							className='outlineNone focus:outlineNone w-full cursor-default  bg-transparent text-center text-sm  font-semibold  text-gray-700 hover:text-black  focus:text-black md:text-base'
							name='custom-input-number'
							value={milesTicketInput.toString()}
						/>
					</div>
					<div className='flex h-full flex-col'>
						<button
							onClick={onMilesTicketIncrement}
							data-action='increment'
							className='flex h-1/2 w-7 cursor-pointer items-center justify-center rounded-tr text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus:outline-none'
						>
							<span className='mt-1'>
								<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
									<path fill='currentColor' d='m7 14l5-5l5 5H7z' />
								</svg>
							</span>
						</button>
						<button
							onClick={onMilesTicketDecrement}
							data-action='decrement'
							className='flex h-1/2 w-7 cursor-pointer items-center justify-center rounded-br text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus:outline-none '
						>
							<span className='mb-1'>
								<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'>
									<path fill='currentColor' d='m7 10l5 5l5-5H7z' />
								</svg>
							</span>
						</button>
					</div>
				</div>
			</div>
			{/* Miles Ticket Counter */}
		</div>
	);
}

export default CartItem;
