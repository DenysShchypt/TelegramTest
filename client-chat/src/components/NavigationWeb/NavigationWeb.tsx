import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavigationWeb.module.css';
import { useAuth } from '../../utils/hooks/useAuth';

const NavigationWeb: FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <nav>
      <NavLink className={styles.link} to="/">
        Home
      </NavLink>
      {isLoggedIn && (
        <NavLink className={styles.link} to="/tasks">
          Tasks
        </NavLink>
      )}
    </nav>
  );
};

export default NavigationWeb;
