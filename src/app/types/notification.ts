import {
  NOTIFICATION_TOKEN_DEVICE_TYPE,
  NOTIFICATION_TOKEN_STATUS,
  NOTIFICATION_TYPES,
} from "../common/enum";
import { IUserData } from "./user";

export interface INotificationPayload {
  // Interface for the data that is sent from the FCM or APN
  notificationType: string;
  post_id?: string;
  followerId?: string;
  challenge_id?: string;
}

export interface INotification {
  id: string;
  user: Pick<IUserData, "id" | "name" | "avatar">;
  isRead: boolean;
  progressId?: string;
  challengeId?: string;
  newFollowerId?: string;
  type: NOTIFICATION_TYPES;
  createdAt: Date;
  challengeName?: string;
}

export interface IPushNotificationToken {
  notificationToken: string;
  status: NOTIFICATION_TOKEN_STATUS;
  deviceType: NOTIFICATION_TOKEN_DEVICE_TYPE;
}

export interface INotificationResponse {
  // Raw payload response from API
  id: string;
  user: Pick<IUserData, "id" | "name" | "surname" | "avatar">;
  title: NOTIFICATION_TYPES;
  body: string;
  createdAt: Date;
  createdBy: string;
  isRead: boolean;
}