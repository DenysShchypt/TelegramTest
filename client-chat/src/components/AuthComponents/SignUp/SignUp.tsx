import { FC } from 'react';
import styles from './SignUp.module.css';
import { FiUser } from 'react-icons/fi';
import { IoMailOpenOutline } from 'react-icons/io5';
import { GoLock } from 'react-icons/go';
import { IPropsRegister } from '../../../common/types/auth';

const SignUp: FC<IPropsRegister> = (props: IPropsRegister) => {
  const { navigate, register, errors } = props;
  return (
    <div className={styles.auth_container}>
      <div className={styles.inputs_wrap}>
        <div>
          <label className={styles.input_wrap}>
            <FiUser size={20} />
            <input
              className={styles.input_field}
              type="text"
              autoComplete="on"
              placeholder="USERNAME"
              {...register('username', {
                required: 'Enter your username',
              })}
            />
          </label>
          {errors.username && (
            <p className={styles.error_message}>{errors.username.message}</p>
          )}
        </div>
        <div>
          <label className={styles.input_wrap}>
            <IoMailOpenOutline size={20} />
            <input
              className={styles.input_field}
              type="email"
              autoComplete="on"
              placeholder="EMAIL"
              {...register('email', {
                required: 'Enter your email',
              })}
            />
          </label>
          {errors.email && (
            <p className={styles.error_message}>{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className={styles.input_wrap}>
            <GoLock size={20} />
            <input
              className={styles.input_field}
              type="password"
              placeholder="PASSWORD"
              autoComplete="off"
              {...register('password', {
                required: 'Enter your password',
              })}
            />
          </label>
          {errors.password && (
            <p className={styles.error_message}>{errors.password.message}</p>
          )}
        </div>
      </div>
      <button type="submit" className={styles.button_send_form}>
        REGISTER
      </button>
      <div className={styles.forgot_account_wrap}>
        <button
          className={styles.auxiliary_button}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
        >
          If you have an account?
        </button>
      </div>
    </div>
  );
};

export default SignUp;
