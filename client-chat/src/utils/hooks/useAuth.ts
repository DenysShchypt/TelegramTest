import {
  selectIsLoading,
  selectIsLoggedIn,
  selectUser,
} from "../../redux/auth/auth.selectors";
import { useAppSelector } from "./redux-hooks";

export const useAuth = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isLoading = useAppSelector(selectIsLoading);
  const user = useAppSelector(selectUser);

  return {
    isLoggedIn,
    isLoading,
    user,
  };
};
