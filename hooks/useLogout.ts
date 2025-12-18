import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { resetBaseApiState } from "@/api/baseApi";
import { resetAuthApiState } from "@/store/auth/authApi";
import { useNavigation } from "@react-navigation/native";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogout = () => {
    // Clear all Redux state
    dispatch(logout());
    dispatch(resetBaseApiState());
    dispatch(resetAuthApiState());
  };

  return handleLogout;
};
