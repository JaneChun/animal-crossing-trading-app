import { ReactNode } from 'react';

type Color = 'mint' | 'white-hover-mint' | 'white' | 'gray';
type Size = 'sm' | 'md' | 'md2' | 'lg';

interface ButtonProps {
	type?: 'submit' | undefined;
	color: Color;
	size: Size;
	className?: string;
	onClick?: () => void;
	children: ReactNode;
}

function Button({ type, color, size, className, onClick, children }: ButtonProps) {
	let combinedClassName = '';

	switch (color) {
		case 'mint': {
			combinedClassName = 'mr-2 rounded-lg border border-mint bg-mint font-semibold text-white hover:bg-hover-mint focus:ring-ring-mint';
			break;
		}
		case 'white': {
			combinedClassName = 'mr-2 rounded-lg border border-mint bg-transparent font-semibold text-mint  hover:bg-gray-100 focus:ring-gray-300';
			break;
		}
		case 'white-hover-mint': {
			combinedClassName =
				'rounded-lg border border-mint bg-transparent font-semibold text-mint hover:border-transparent hover:bg-mint hover:text-white focus:ring-ring-mint';
			break;
		}
		case 'gray': {
			combinedClassName =
				'inline-flex items-center rounded-lg border border-gray-300 bg-white text-center font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-gray-200';
			break;
		}
	}

	switch (size) {
		case 'sm': {
			combinedClassName += ' py-1.5 px-3 text-sm focus:ring-4';
			break;
		}
		case 'md': {
			combinedClassName += ' py-2 px-4 text-sm focus:ring-2';
			break;
		}
		case 'md2': {
			combinedClassName += ' py-2.5 px-4 text-sm focus:ring-4';
			break;
		}
		case 'lg': {
			combinedClassName += ' py-2 px-4 text-base focus:ring-4';
			break;
		}
	}

	return (
		<button type={type ? type : 'button'} className={`${combinedClassName} ${className}`} onClick={onClick}>
			{children}
		</button>
	);
}

export default Button;
