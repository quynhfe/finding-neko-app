import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './AuthContext';
import type { AuthStackParamList, MainTabParamList, RootStackParamList } from './navigationTypes';
import { colors, radius, shadow } from '@/design/tokens';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { RegisterScreen } from '@/features/auth/RegisterScreen';
import { VerifyOtpScreen } from '@/features/auth/VerifyOtpScreen';
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen';
import { CatSetupScreen } from '@/features/cats/CatSetupScreen';
import { HomeScreen } from '@/features/home/HomeScreen';
import { ChallengeHomeScreen, ChallengeFlowScreen } from '@/features/challenge/ChallengeScreens';
import { DiaryScreen } from '@/features/diary/DiaryScreen';
import { CommunityScreen } from '@/features/community/CommunityScreen';
import { ProfileScreen } from '@/features/settings/ProfileScreen';
import { LostFlowScreen } from '@/features/lost/LostFlowScreen';
import { RadarFlowScreen } from '@/features/radar/RadarFlowScreen';
import { NotificationsScreen } from '@/features/notifications/NotificationsScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { LeaderboardScreen } from '@/features/leaderboard/LeaderboardScreen';
import { MascotImage } from '@/components/MascotImage';
import { AppText } from '@/components/AppText';

const Root = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function LoadingScreen() {
  const pulse = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();
    shimmerAnimation.start();

    return () => {
      pulseAnimation.stop();
      shimmerAnimation.stop();
    };
  }, [pulse, shimmer]);

  const mascotStyle = {
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1.03],
        }),
      },
    ],
  };
  const shimmerStyle = {
    transform: [
      {
        translateX: shimmer.interpolate({
          inputRange: [0, 1],
          outputRange: [-96, 260],
        }),
      },
    ],
  };

  return (
    <View style={styles.loading}>
      <View style={styles.loadingHalo} />
      <Animated.View style={[styles.loadingMascot, mascotStyle]}>
        <MascotImage size={158} />
      </Animated.View>
      <View style={styles.loadingCopy}>
        <AppText variant="h1" center>
          Finding Neko
        </AppText>
        <AppText variant="body" color={colors.textSecondary} center style={styles.loadingText}>
          Đang chuẩn bị không gian cho mèo của bạn...
        </AppText>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressShimmer, shimmerStyle]} />
      </View>
      <View style={styles.loadingDots}>
        <Animated.View style={[styles.loadingDot, { opacity: pulse }]} />
        <Animated.View
          style={[
            styles.loadingDot,
            {
              opacity: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.45, 0.85],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.loadingDot,
            {
              opacity: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Challenge'
                ? 'star'
                : route.name === 'Camera'
                  ? 'camera'
                  : route.name === 'Community'
                    ? 'heart'
                    : 'user';
          const isCamera = route.name === 'Camera';
          return (
            <View style={isCamera ? styles.cameraTab : undefined}>
              <Feather name={icon} size={isCamera ? 28 : size} color={isCamera ? colors.text : color} />
            </View>
          );
        },
      })}>
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tabs.Screen name="Challenge" component={ChallengeHomeScreen} options={{ title: 'Challenge' }} />
      <Tabs.Screen name="Camera" component={HomeScreen} options={{ title: '' }} />
      <Tabs.Screen name="Community" component={CommunityScreen} options={{ title: 'Community' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tabs.Navigator>
  );
}

function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Root.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Root.Screen name="Main" component={MainTabs} />
          <Root.Screen name="Onboarding" component={OnboardingScreen} />
          <Root.Screen name="CatSetup" component={CatSetupScreen} />
          <Root.Screen name="ChallengeFlow" component={ChallengeFlowScreen} />
          <Root.Screen name="DiaryDetail" component={DiaryScreen} />
          <Root.Screen name="LostFlow" component={LostFlowScreen} />
          <Root.Screen name="RadarFlow" component={RadarFlowScreen} />
          <Root.Screen name="Notifications" component={NotificationsScreen} />
          <Root.Screen name="Settings" component={SettingsScreen} />
          <Root.Screen name="Leaderboard" component={LeaderboardScreen} />
        </>
      )}
    </Root.Navigator>
  );
}

export function AppRoot() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
    overflow: 'hidden',
  },
  loadingHalo: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.yellowTint,
    top: '24%',
  },
  loadingMascot: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...shadow.card,
  },
  loadingCopy: {
    gap: 8,
    marginBottom: 28,
  },
  loadingText: {
    maxWidth: 260,
    lineHeight: 20,
  },
  progressTrack: {
    width: 260,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressShimmer: {
    width: 96,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.text,
  },
  tabBar: {
    height: 74,
    borderTopWidth: 0,
    backgroundColor: colors.card,
    elevation: 12,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    paddingBottom: 8,
  },
  cameraTab: {
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
});
