import type { ReactNode } from 'react';

export type BadgeTone = 'danger' | 'info' | 'neutral' | 'success' | 'warn';

interface IProps {
    children: ReactNode;
    tone: BadgeTone;
}

export function Badge({ children, tone }: IProps) {
    return <span className = { `badge badge--${tone}` }>{children}</span>;
}
