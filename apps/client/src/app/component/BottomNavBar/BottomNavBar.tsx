import { FC } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform } from 'react-native';

import HomeScreen from '../../screen/HomeScreen';
import NotificationsScreen from '../../screen/NotificationsScreen/NotificationsScreen';
import PersonalProfileScreen from '../../screen/ProfileScreen/Personal/PersonalProfileScreen';
import CompanyProfileScreen from '../../screen/ProfileScreen/Company/CompanyProfileScreen';
import PersonalChallengesNavigator from '../../screen/ChallengesScreen/PersonalChallengesScreen/PersonalChallengesScreen';
import CompanyChallengesScreen from '../../screen/ChallengesScreen/CompanyChallengesScreen/CompanyChallengesScreen';

import FeedSvg from './asset/feed.svg';
import CreateSvg from './asset/create.svg';
import ChallengesSvg from './asset/challenges.svg';
import ProfileSvg from './asset/profile.svg';
import AlertSvg from './asset/noti.svg';
import { useGetUserData } from '../../hooks/useGetUser';
import { useUserProfileStore } from '../../store/user-data';

const Tab = createBottomTabNavigator();
const EmptyPage = () => null;

interface IBottomNavBarProps {}

const BottomNavBar: FC<IBottomNavBarProps> = () => {
  const { t } = useTranslation();
  const isAndroid = Platform.OS === 'android';
  useGetUserData();

  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();
  const isCompany = currentUser && currentUser?.companyAccount;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: true,
        headerTitleAlign: 'center',

        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FFFFFF',
          height: isAndroid ? 68 : 102,
          paddingBottom: isAndroid ? 0 : 30,
        },
        headerRightContainerStyle: {
          paddingRight: 10,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <FeedSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.feed')}
              </Text>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name="Challenges"
        component={
          isCompany ? CompanyChallengesScreen : PersonalChallengesNavigator
        }
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <ChallengesSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.challenges')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Create Challenge"
        component={EmptyPage}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            if (isCompany) navigation.navigate('CreateCompanyChallengeScreen');
            else navigation.navigate('CreateChallengeScreen');
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <CreateSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.create')}
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View className={clsx('flex flex-col items-center justify-center')}>
              <AlertSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
              <Text
                className={clsx(
                  'text-gray-bottomBar text-md pt-1.5',
                  focused && 'text-primary-default'
                )}
              >
                {t('bottom_nav.noti')}
              </Text>
            </View>
          ),
        }}
      />
      {!isCompany ? (
        <Tab.Screen
          name="Profile"
          component={PersonalProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View
                className={clsx('flex flex-col items-center justify-center')}
              >
                <ProfileSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
                <Text
                  className={clsx(
                    'text-gray-bottomBar text-md pt-1.5',
                    focused && 'text-primary-default'
                  )}
                >
                  {t('bottom_nav.profile')}
                </Text>
              </View>
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Company Profile"
          component={CompanyProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View
                className={clsx('flex flex-col items-center justify-center')}
              >
                <ProfileSvg fill={focused ? '#FF7B1C' : '#6C6E76'} />
                <Text
                  className={clsx(
                    'text-gray-bottomBar text-md pt-1.5',
                    focused && 'text-primary-default'
                  )}
                >
                  {t('bottom_nav.profile')}
                </Text>
              </View>
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default BottomNavBar;
