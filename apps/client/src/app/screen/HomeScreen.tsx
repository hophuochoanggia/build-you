/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect } from 'react';
import { View, FlatList, SafeAreaView, Text } from 'react-native';
import clsx from 'clsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { t, use } from 'i18next';

import { RootStackParamList } from '../navigation/navigation.type';

import OtherUserProfileScreen from './ProfileScreen/OtherUser/OtherUserProfileScreen';

import AppTitle from '../component/common/AppTitle';
import Button from '../component/common/Buttons/Button';
import FeedPostCard, {
  FeedPostCardUnregister,
} from '../component/Post/FeedPostCard';
import NavButton from '../component/common/Buttons/NavButton';
import IconSearch from '../component/common/IconSearch/IconSearch';

import ShareIcon from '../../../assets/svg/share.svg';
import OtherUserProfileChallengeDetailsScreen from './ProfileScreen/OtherUser/OtherUserProfileChallengeDetailsScreen';
import { serviceGetFeed, serviceGetFeedUnregistered } from '../service/feed';

import { useGetListFollowing } from '../hooks/useGetUser';
import GlobalDialogController from '../component/common/Dialog/GlobalDialogController';
import { useAuthStore } from '../store/auth-store';
import { useUserProfileStore } from '../store/user-data';
import { useIsFocused } from '@react-navigation/native';
import MainSearchScreen from './MainSearchScreen/MainSearchScreen';

const HomeScreenStack = createNativeStackNavigator<RootStackParamList>();

interface IFeedDataProps {}

export const HomeFeed = () => {
  const [feedData, setFeedData] = React.useState<any>([]);
  const [feedPage, setFeedPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  useGetListFollowing();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  const isFocused = useIsFocused();

  const getInitialFeeds = async () => {
    await serviceGetFeed({
      page: 1,
      take: 5,
    })
      .then((res) => {
        if (res.data?.data) {
          setFeedData(res.data.data);
          setFeedPage(1);
        }
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: 'Error',
          message:
            t('error_general_message') ||
            'Something went wrong. Please try again later!',
        });
      });
  };

  useEffect(() => {
    getInitialFeeds();
  }, []);

  const getNewFeed = async () => {
    await serviceGetFeed({
      page: feedPage + 1,
      take: 5,
    }).then((res) => {
      if (res?.data?.data) {
        setFeedData((prev: any) => [...prev, ...res.data.data]);
      }
      setFeedPage((prev) => prev + 1);
    });
  };

  const handleScroll = async () => {
    setIsRefreshing(true);
    await getInitialFeeds();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className={clsx('bg-white')}>
      <View className={clsx('h-full w-full bg-gray-50')}>
        {userData && (
          <FlatList
            data={feedData}
            renderItem={({ item }) => (
              <FeedPostCard
                itemFeedPostCard={item}
                userId={userData.id}
                isFocused={isFocused}
              />
            )}
            keyExtractor={(item) => item.id as unknown as string}
            onEndReached={getNewFeed}
            onEndReachedThreshold={0.7}
            onRefresh={handleScroll}
            refreshing={isRefreshing}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export const HomeFeedUnregister = () => {
  const [feedData, setFeedData] = React.useState<any>([]);
  const [feedPage, setFeedPage] = React.useState<number>(1);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  const getInitialFeeds = async () => {
    await serviceGetFeedUnregistered({
      page: 1,
      take: 5,
    })
      .then((res) => {
        if (res.data?.data) {
          setFeedData(res.data.data);
          setFeedPage(1);
        }
      })
      .catch((err) => {
        GlobalDialogController.showModal({
          title: 'Error',
          message:
            t('error_general_message') ||
            'Something went wrong. Please try again later!',
        });
      });
  };

  useEffect(() => {
    getInitialFeeds();
  }, []);

  const getNewFeed = async () => {
    await serviceGetFeedUnregistered({
      page: feedPage + 1,
      take: 5,
    }).then((res) => {
      if (res?.data?.data) {
        setFeedData((prev: any) => [...prev, ...res.data.data]);
      }
      setFeedPage((prev) => prev + 1);
    });
  };

  const handleScroll = async () => {
    setIsRefreshing(true);
    await getInitialFeeds();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className={clsx('bg-white')}>
      <View className={clsx('h-full w-full bg-gray-50')}>
        <FlatList
          data={feedData}
          renderItem={({ item }) => (
            <FeedPostCardUnregister itemFeedPostCard={item} />
          )}
          keyExtractor={(item) => item.id as unknown as string}
          onEndReached={getNewFeed}
          onEndReachedThreshold={0.7}
          onRefresh={handleScroll}
          refreshing={isRefreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const HomeScreen = () => {
  const { getAccessToken } = useAuthStore();

  const logined = getAccessToken();

  return (
    <HomeScreenStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShown: false,
      }}
    >
      {!logined && (
        <HomeScreenStack.Screen
          name="FeedScreenUnregister"
          component={HomeFeedUnregister}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: () => <AppTitle title={t('your_feed.header')} />,
            headerRight: (props) => (
              <NavButton
                withIcon
                icon={
                  <IconSearch
                    onPress={() =>
                      navigation.navigate('CompleteProfileStep3Screen')
                    }
                  />
                }
              />
            ),
          })}
        />
      )}
      {logined && (
        <>
          <HomeScreenStack.Screen
            name="FeedScreen"
            component={HomeFeed}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => <AppTitle title={t('your_feed.header')} />,
              headerRight: (props) => (
                <NavButton
                  withIcon
                  icon={
                    <IconSearch
                      onPress={() => navigation.navigate('MainSearchScreen')}
                    />
                  }
                />
              ),
            })}
          />

          <HomeScreenStack.Screen
            name="MainSearchScreen"
            component={MainSearchScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <Text className="text-lg font-semibold">Search User</Text>
              ),
              headerSearchBarOptions: {
                hideNavigationBar: false,
              },
              headerLeft: () => (
                <NavButton
                  text={t('button.back') as string}
                  onPress={() => navigation.goBack()}
                  withBackIcon
                />
              ),
            })}
          />

          <HomeScreenStack.Screen
            name="OtherUserProfileScreen"
            component={OtherUserProfileScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => '',
              headerLeft: (props) => (
                <NavButton
                  text={t('button.back') as string}
                  onPress={() => {
                    const routes = navigation.getState()?.routes;
                    const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route
                    if (prevRoute?.name === 'MainSearchScreen') {
                      navigation.getParent()?.setOptions({
                        tabBarStyle: {
                          display: 'none',
                          backgroundColor: '#FFFFFF',
                        },
                      });
                    }
                    navigation.goBack();
                  }}
                  withBackIcon
                />
              ),
            })}
          />

          <HomeScreenStack.Screen
            name="OtherUserProfileChallengeDetailsScreen"
            component={OtherUserProfileChallengeDetailsScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => '',
              headerLeft: (props) => (
                <NavButton
                  text={t('button.back') as string}
                  onPress={() => navigation.goBack()}
                  withBackIcon
                />
              ),
              headerRight: () => {
                return (
                  <View>
                    <Button
                      Icon={<ShareIcon />}
                      onPress={() => console.log('press share')}
                    />
                  </View>
                );
              },
            })}
          />
        </>
      )}
    </HomeScreenStack.Navigator>
  );
};

export default HomeScreen;
