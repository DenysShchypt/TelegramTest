import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { BackLink } from '../../BackLink/BackLink';

const ChatMessages: FC = () => {
  //   const { id } = useParams();
  // const product = getProductById(id);
  const location = useLocation();
  const backLinkHref = location.state?.from ?? '/chats';
  return (
    <div>
      <BackLink to={backLinkHref}>Back to chats</BackLink>
      <img src="https://via.placeholder.com/960x240" alt="" />
      <div>
        <h2>Chat name?</h2>
        <ul className="">
          <li>
            <p></p>
            <p></p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatMessages;
