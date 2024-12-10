import { FC } from 'react';
import styles from './Home.module.css';

const Home: FC = () => {
  return (
    <div className={styles.home_wrap}>
      <h1 className={styles.home_tittle}>Welcome to telegram chats📱</h1>
    </div>
  );
};

export default Home;
