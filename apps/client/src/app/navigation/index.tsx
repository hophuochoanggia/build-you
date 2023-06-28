/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useRef, useState } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigation,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as TaskManager from 'expo-task-manager';
import { RootStackParamList } from './navigation.type';

import Header from '../component/common/Header';
import AppTitle from '../component/common/AppTitle';
import NavButton from '../component/common/Buttons/NavButton';
import BottomNavBar from '../component/BottomNavBar/BottomNavBar';

import IntroScreen from '../screen/IntroScreen/IntroScreen';
import ProgressCommentScreen from '../screen/ChallengesScreen/ProgressCommentScreen/ProgressCommentScreen';

import SettingsScreen from '../screen/SettingsScreen/SettingsScreen';

import CompleteProfileScreen from '../screen/OnboardingScreens/CompleteProfile/CompleteProfile';
import CreateChallengeScreen from '../screen/ChallengesScreen/PersonalChallengesScreen/CreateChallengeScreen/CreateChallengeScreen';
import CreateCompanyChallengeScreen from '../screen/ChallengesScreen/CompanyChallengesScreen/CreateCompanyChallengeScreen/CreateCompanyChallengeScreen';
import CompanyChallengeDetailScreen from '../screen/ChallengesScreen/CompanyChallengesScreen/CompanyChallengeDetailScreen/CompanyChallengeDetailScreen';
import EditPersonalProfileScreen from '../screen/ProfileScreen/Personal/EditPersonalProfileScreen/EditPersonalProfileScreen';
import PersonalProfileScreenLoading from '../screen/ProfileScreen/Personal/PersonalProfileScreenLoading';
import EditCompanyProfileScreen from '../screen/ProfileScreen/Company/EditCompanyProfileScreen/EditCompanyProfileScreen';

import Login from '../screen/LoginScreen/LoginScreen';
import Register from '../screen/RegisterScreen/RegisterScreen';
import ForgotPassword from '../screen/ForgotPassword/ForgotPassword';

import { checkUserCompleProfileAndCompany } from '../utils/checkUserCompleProfile';
import { checkAccessTokenLocal } from '../utils/checkAuth';

import { useAuthStore } from '../store/auth-store';
import { useIsCompleteProfileStore } from '../store/is-complete-profile';
import BottomNavBarWithoutLogin from '../component/BottomNavBar/BottomNavBarWithoutLogin';
import GlobalDialog from '../component/common/Dialog/GlobalDialog';
import {
  handleNewNotification,
  handleUserTapOnNotification,
  registerForPushNotificationsAsync,
} from '../utils/notification.util';
import { useNotificationStore } from '../store/notification';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Set to true to display notifications in foreground, issue: https://github.com/expo/expo/issues/20351
    shouldSetBadge: false,
  }),
});

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootNavigation = () => {
  const { t } = useTranslation();
  const [isMainAppLoading, setIsMainAppLoading] = useState<boolean>(true);

  const { setAccessToken, getAccessToken } = useAuthStore();
  const { setIsCompleteProfileStore, getIsCompleteProfileStore } =
    useIsCompleteProfileStore();
  const { setPushToken, setHasNewNotification } = useNotificationStore();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);
  TaskManager.defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }) => handleNewNotification(data.notification)
  );

  const logined = getAccessToken();

  const isCompleteProfile: boolean | null = getIsCompleteProfileStore();

  useEffect(() => {
    checkAccessTokenLocal(setAccessToken);
  }, []);

  useEffect(() => {
    if (logined && navigationRef.current) {
      setIsCompleteProfileStore(null);
      checkUserCompleProfileAndCompany(
        setIsCompleteProfileStore,
        setIsMainAppLoading
      );
      initNotification(navigationRef.current);
    } else if (!logined && logined !== null) {
      setIsCompleteProfileStore(false);
      setIsMainAppLoading(false);
    }

    return () => {
      // cleanup the listener and task registry
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    };
  }, [logined, navigationRef.current]);

  useEffect(() => {
    if (!isMainAppLoading && isCompleteProfile !== null && logined !== null) {
      const hideSplashScreen = async () => {
        await SplashScreen.hideAsync();
      };
      setTimeout(() => {
        hideSplashScreen();
      }, 700);
    }
  }, [isMainAppLoading, isCompleteProfile]);

  const initNotification = (
    navigation: NavigationContainerRef<RootStackParamList>
  ) => {
    // register task to run whenever is received while the app is in the background
    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    registerForPushNotificationsAsync().then((token) => {
      if (token) setPushToken(token);
    });

    // listener triggered whenever a notification is received while the app is in the foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('notification: ', notification.request.content.data);
      setHasNewNotification(true);
    });

    // listener triggered whenever a user taps on a notification
    Notifications.addNotificationResponseReceivedListener((response) => {
      handleUserTapOnNotification(response, navigation);
      setHasNewNotification(false); // reset the new notification flag
    });
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <GlobalDialog />
      <RootStack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      >
        {logined && isCompleteProfile && (
          <>
            <RootStack.Screen
              name="HomeScreen"
              component={BottomNavBar}
              options={{
                headerShown: false,
                headerTitle: () => (
                  <Header
                    title={t('challenge_detail_screen.title') || undefined}
                  />
                ),
                headerLeft: (props) => {
                  return <NavButton />;
                },
              }}
            />
            <RootStack.Screen
              name="CreateChallengeScreen"
              component={CreateChallengeScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="CreateCompanyChallengeScreen"
              component={CreateCompanyChallengeScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="CompanyChallengeDetailScreen"
              component={CompanyChallengeDetailScreen}
              options={{
                headerShown: false,
              }}
            />

            <RootStack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
            />

            <RootStack.Screen
              name="EditPersonalProfileScreen"
              component={EditPersonalProfileScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => <AppTitle title="Edit profile" />,
                headerLeft: (props) => (
                  <NavButton
                    text="Back"
                    onPress={() => navigation.goBack()}
                    withBackIcon
                  />
                ),
              })}
            />
            <RootStack.Screen
              name="EditCompanyProfileScreen"
              component={EditCompanyProfileScreen}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => <AppTitle title="Edit profile" />,
                headerLeft: (props) => (
                  <NavButton
                    text="Back"
                    onPress={() => navigation.goBack()}
                    withBackIcon
                  />
                ),
              })}
            />
            {/* <RootStack.Screen
              name="NotificationsScreen"
              component={NotificationsScreen}
              options={{
                headerShown: false,
              }}
            /> */}
          </>
        )}
        {logined && !isCompleteProfile && isCompleteProfile !== null && (
          <>
            <RootStack.Screen
              name="CompleteProfileScreen"
              component={CompleteProfileScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}

        {logined && isCompleteProfile === null && (
          <>
            <RootStack.Screen
              name="ProfileScreenLoading"
              component={PersonalProfileScreenLoading}
              options={{
                headerShown: false,
              }}
            />
          </>
        )}

        {!logined && (
          <>
            <RootStack.Screen
              name="IntroScreen"
              component={IntroScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="LoginScreen"
              component={Login}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => <AppTitle title={t('login_screen.login')} />,

                headerLeft: (props) => (
                  <NavButton
                    text={t('button.back') as string}
                    onPress={() => navigation.navigate('IntroScreen')}
                    withBackIcon
                  />
                ),
              })}
            />

            <RootStack.Screen
              name="RegisterScreen"
              component={Register}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => (
                  <AppTitle title={t('register_screen.title')} />
                ),

                headerLeft: (props) => (
                  <NavButton
                    text={t('button.back') as string}
                    onPress={() =>
                      navigation.navigate('IntroScreen', { setModal: true })
                    }
                    withBackIcon
                  />
                ),
              })}
            />

            <RootStack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPassword}
              options={({ navigation }) => ({
                headerShown: true,
                headerTitle: () => (
                  <AppTitle title={t('forgot_password.title')} />
                ),

                headerLeft: (props) => (
                  <NavButton
                    text={t('button.back') as string}
                    onPress={() => navigation.navigate('LoginScreen')}
                    withBackIcon
                  />
                ),
              })}
            />
            <RootStack.Screen
              name="HomeScreenWithoutLogin"
              component={BottomNavBarWithoutLogin}
              options={{
                headerShown: false,
                headerTitle: () => (
                  <Header
                    title={t('challenge_detail_screen.title') || undefined}
                  />
                ),
                headerLeft: (props) => {
                  return <NavButton />;
                },
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
