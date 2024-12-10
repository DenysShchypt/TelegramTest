import { HiArrowLeft } from 'react-icons/hi';
import { Link, LinkProps } from 'react-router-dom';
import styles from './BackLink.module.css';
import { FC, ReactNode } from 'react';

interface BackLinkProps {
  to: LinkProps['to'];
  children: ReactNode;
}

export const BackLink: FC<BackLinkProps> = ({ to, children }) => {
  return (
    <Link to={to} className={styles.wrap}>
      <HiArrowLeft size="24" />
      {children}
    </Link>
  );
};
