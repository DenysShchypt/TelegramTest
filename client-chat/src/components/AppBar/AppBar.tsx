import { FC } from 'react';
import { useAuth } from '../../utils/hooks/useAuth';
import styles from './AppBar.module.css';
import NavigationWeb from '../NavigationWeb/NavigationWeb';
import AuthNav from '../AuthNav/AuthNav';
import UserMenu from '../UserMenu/UserMenu';

const AppBar: FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className={styles.header}>
      <NavigationWeb />
      {isLoggedIn ? <UserMenu /> : <AuthNav />}
    </header>
  );
};

export default AppBar;
