export type AuthStackParamList = {
  Login: undefined;
  Profile: undefined;
  VerifyEmail: { userEmail: string };
  ForgetPassword: undefined;
  Register: undefined;
  ResetPassword: { userEmail: string };
};
