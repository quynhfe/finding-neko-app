export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
  CatSetup: undefined;
  ChallengeFlow: undefined;
  DiaryDetail: undefined;
  LostFlow: undefined;
  RadarFlow: undefined;
  Notifications: undefined;
  Settings: undefined;
  Leaderboard: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyOtp: {
    username: string;
    email: string;
    password: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Challenge: undefined;
  Camera: undefined;
  Community: undefined;
  Profile: undefined;
};
