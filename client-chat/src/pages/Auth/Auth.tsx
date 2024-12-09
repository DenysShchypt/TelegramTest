import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './Auth.module.css';
import { LoginSchema, RegisterSchema } from '../../utils/yup/authForm';
import { useAppDispatch } from '../../utils/hooks/redux-hooks';
import { IFormData, IFormDataRegister } from '../../common/types/auth';
import SignUp from '../../components/AuthComponents/SignUp/SignUp';
import SignIn from '../../components/AuthComponents/SignIn/SignIn';
import { loginUser, registerUser } from '../../redux/auth/auth.thunks';

const Auth: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData | IFormDataRegister>({
    resolver: yupResolver(
      location.pathname === '/login' ? LoginSchema : RegisterSchema
    ),
  });

  const onFormSubmit: SubmitHandler<IFormData | IFormDataRegister> = async (
    data
  ) => {
    if (location.pathname === '/login') {
      try {
        const loginData = data as IFormData;
        dispatch(loginUser(loginData));
        navigate('/chats');
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const registerData = data as IFormDataRegister;
        dispatch(registerUser(registerData));
        navigate('/chats');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form_wrap}>
        <div>
          {location.pathname === '/login' ? (
            <SignIn navigate={navigate} register={register} errors={errors} />
          ) : location.pathname === '/register' ? (
            <SignUp navigate={navigate} register={register} errors={errors} />
          ) : null}
        </div>
      </form>
    </>
  );
};

export default Auth;
