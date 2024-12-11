import { FC } from 'react';
import { IoMailOpenOutline } from 'react-icons/io5';
import { GoLock } from 'react-icons/go';
import { VscSignIn } from 'react-icons/vsc';
import styles from './SignIn.module.css';
import { IPropsLogin } from '../../../common/types/auth';

const SignIn: FC<IPropsLogin> = (props: IPropsLogin) => {
  const { navigate, register, errors } = props;
  return (
    <div className={styles.auth_container}>
      <div className={styles.inputs_wrap}>
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
              autoComplete="on"
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
        LOGIN
      </button>
      <div className={styles.forgot_password_wrap}>
        <div className={styles.auxiliary_button}>
          <VscSignIn size={20} className={styles.auxiliary_icon} />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
