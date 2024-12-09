import { FC } from 'react';
import styles from './AuthNav.module.css';
import { NavLink } from 'react-router-dom';

const AuthNav: FC = () => {
  return (
    <div>
      <NavLink className={styles.link} to="/register">
        Register
      </NavLink>
      <NavLink className={styles.link} to="/login">
        Log In
      </NavLink>
    </div>
  );
};

export default AuthNav;
