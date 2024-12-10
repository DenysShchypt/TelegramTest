import { FC, useState } from 'react';
import styles from './ConnectChats.module.css';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/redux-hooks';
import { selectIsConfirmCode } from '../../redux/telegram/telegram.selectors';
import { confirmCode, sendCode } from '../../redux/telegram/telegram.thunks';

const ConnectChats: FC = () => {
  const dispatch = useAppDispatch();
  const isConfirmCode = useAppSelector(selectIsConfirmCode);

  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const sendConnect = {
      phone_number: phoneNumber,
    };
    const sendConfirm = {
      phone_number: phoneNumber,
      code,
    };

    if (!isConfirmCode) {
      dispatch(sendCode(sendConnect));
    } else {
      dispatch(confirmCode(sendConfirm));
    }
  };
  return (
    <div>
      <form className={styles.form_wrap} onSubmit={handleConnect}>
        <label className={styles.input_wrap}>
          <span>Phone Number:</span>
          <input
            type="text"
            value={phoneNumber}
            placeholder={phoneNumber ? phoneNumber : 'Type the phone number'}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles.input_field}
          />
        </label>
        {isConfirmCode && (
          <label className={styles.input_wrap}>
            <span>Code:</span>
            <input
              type="text"
              placeholder="Type your telegram code"
              onChange={(e) => setCode(e.target.value)}
              className={styles.input_field}
            />
          </label>
        )}
        <button type="submit" className={styles.send_button}>
          Connect
        </button>
      </form>
    </div>
  );
};

export default ConnectChats;
