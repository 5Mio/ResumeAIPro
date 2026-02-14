import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'hover' | 'featured';
    children: ReactNode;
}

export default function Card({ className, variant = 'default', children, ...props }: CardProps) {
    const baseStyles = 'bg-white rounded-xl border border-gray-200 transition-all duration-300';

    const variants = {
        default: 'p-6',
        hover: 'p-6 hover:shadow-xl hover:scale-105 hover:border-blue-300 cursor-pointer',
        featured: 'p-8 shadow-lg border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50'
    };

    return (
        <div className={cn(baseStyles, variants[variant], className)} {...props}>
            {children}
        </div>
    );
}
