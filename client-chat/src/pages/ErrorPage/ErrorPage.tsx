import { FC } from "react";
import styles from "./ErrorPage.module.css";

const ErrorPage: FC = () => {
  return (
    <>
      <div className="o-404">
        <h1 className={styles.a_title}>404</h1>
        <p className={styles.a_message}>You came to the wrong neighborhood</p>
        <div className={styles.o_cat}>
          <div className={styles.m_ears}>
            <div className={`${styles.m_ear} ${styles._right}`}></div>
            <div className={`${styles.m_ear} ${styles._left}`}></div>
          </div>
          <div className={styles.m_face}>
            <div className={styles.m_eyes}>
              <div className={`${styles.m_eye} ${styles._left}`}>
                <div className={styles.a_eyePupil}></div>
              </div>
              <div className={`${styles.m_eye} ${styles._right}`}>
                <div className={styles.a_eyePupil}></div>
              </div>
            </div>
            <div className={styles.m_nose}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
