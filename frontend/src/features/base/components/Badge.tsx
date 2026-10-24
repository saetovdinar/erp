import type { ReactNode } from 'react';

import styles from './badge.module.css';

export type BadgeTone = 'danger' | 'info' | 'neutral' | 'success' | 'warn';

interface IProps {
    children: ReactNode;
    tone: BadgeTone;
}

export function Badge({ children, tone }: IProps) {
    return <span className = { `${styles.badge} ${styles[tone]}` }>{children}</span>;
}
