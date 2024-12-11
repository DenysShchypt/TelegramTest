import { FC } from 'react';
import { HiSearch } from 'react-icons/hi';
import styles from './SearchChat.module.css';

interface ISearchChatProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchChat: FC<ISearchChatProps> = ({ value, onChange }) => {
  return (
    <div className={styles.search_wrap}>
      <label className={styles.input_wrap}>
        <HiSearch />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input_field}
        />
      </label>
    </div>
  );
};

export default SearchChat;
