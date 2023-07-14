import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigation.type';
import {
  INotification,
  INotificationPayload,
  INotificationResponse,
} from '../types/notification';
import { NOTIFICATION_TYPES } from '../common/enum';

export const registerForPushNotificationsAsync = async (
  setPushToken: (value: string) => Promise<void>
) => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // Ignore when user doesn't grant permission
      return;
    }

    // This token is used to send notifications to the device through Expo Notification Service.
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // TO DO: send the token to the server to save it for later use

    // This token is used to send notifications to the device directly through APNS or FCM
    // token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log('Expo Push Token: ', token);
    if (token) {
      await setPushToken(token);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

export const notificationPermissionIsAllowed = async (): Promise<boolean> => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    return existingStatus === 'granted';
  } else throw new Error('Must use physical device for Push Notifications');
};

export const handleBackgroundNotification = async (data: any) => {
  await increaseBadgeCount();
};

export const handleTapOnIncomingNotification = async (
  notificationResponse: Notifications.NotificationResponse,
  navigation: NavigationContainerRef<RootStackParamList>
) => {
  const { notification } = notificationResponse;
  const payload = notification.request.content.data as INotificationPayload;

  switch (payload.notification_type) {
    case NOTIFICATION_TYPES.NEW_PROGRESS_FROM_FOLLOWING:
      if (payload.post_id)
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      if (payload.post_id)
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      if (payload.post_id)
        navigation.navigate('ProgressCommentScreen', {
          progressId: payload.post_id,
        });
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      if (payload.new_follower_id)
        navigation.navigate('OtherUserProfileScreen', {
          userId: payload.new_follower_id,
          isFollower: true,
        });
      break;
  }
};

export const handleTapOnNotification = async (
  notification: INotification,
  navigation: NativeStackNavigationProp<RootStackParamList>
) => {
  switch (notification.type) {
    case NOTIFICATION_TYPES.NEW_PROGRESS_FROM_FOLLOWING:
      if (notification.progressId)
        navigation.navigate('ProgressCommentScreen', {
          progressId: '63eb8bc8-ea3b-4568-87da-f2b76aafaf51',
        });
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      if (notification.progressId)
        navigation.navigate('ProgressCommentScreen', {
          progressId: notification.progressId,
        });
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      if (notification.progressId)
        navigation.navigate('ProgressCommentScreen', {
          progressId: notification.progressId,
        });
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      if (notification.user.id)
        navigation.navigate('OtherUserProfileScreen', {
          userId: notification.user.id,
          isFollower: true,
        });
      break;
  }
};

export const getNotificationContent = (
  notificationType: NOTIFICATION_TYPES,
  contentPayload?: any
) => {
  switch (notificationType) {
    case NOTIFICATION_TYPES.NEW_PROGRESS_FROM_FOLLOWING:
      return `has added a new progress in ${
        contentPayload?.challengeName || 'a challenge'
      }`;
      break;
    case NOTIFICATION_TYPES.NEW_COMMENT:
      return `commented on your update`;
      break;
    case NOTIFICATION_TYPES.NEW_MENTION:
      return `mentioned you in a comment`;
      break;
    case NOTIFICATION_TYPES.NEW_FOLLOWER:
      return `has started following you`;
      break;
  }
};

export const increaseBadgeCount = async () => {
  const currentBadgeCount = await Notifications.getBadgeCountAsync();
  console.log('currentBadgeCount: ', currentBadgeCount);
  await Notifications.setBadgeCountAsync(currentBadgeCount + 1);
};

export const clearNotifications = async () => {
  // Dismiss all notification trays and reset badge count
  await Notifications.dismissAllNotificationsAsync();
  await Notifications.setBadgeCountAsync(0);
};

export const mapNotificationResponses = (
  responses: INotificationResponse[]
): INotification[] => {
  return responses.map((response) => {
    const extractUserInfoRegex = /@\[([^\(]+)\(([^)]+)\)/;
    const match = response.body.match(extractUserInfoRegex);
    let username = '';
    let userId = '';
    if (match) {
      username = match[1];
      userId = match[2];
    } else {
      console.log('No match found');
      throw new Error('Something went wrong');
    }
    return {
      id: '',
      type: response.title,
      user: {
        id: userId,
        name: username,
        avatar: 'https://picsum.photos/200',
      },
      createdAt: response.createdAt,
      isRead: false,
    };
  });
};