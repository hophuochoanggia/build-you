import React, { useState, useCallback, useEffect, FC } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Bubble,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

import { IChallenge } from "../../../../types/challenge";

import { useUserProfileStore } from "../../../../store/user-store";
import { useNotificationStore } from "../../../../store/notification-store";

import { getMessageByChallengeId, sendMessage } from "../../../../service/chat";

import SendIcon from "../../../../component/asset/send-icon.svg";
import EmptyChat from "../../../../common/svg/empty-chat.svg";

interface IChatCoachTabProps {
  challengeData: IChallenge;
  isChallengeInProgress: boolean;
}

export const EmptyChatHolder = () => {
  const { t } = useTranslation();
  return (
    <View
      className="flex flex-1 items-center justify-center"
      style={{
        transform: [{ scaleY: -1 }],
      }}
    >
      <EmptyChat />
      <Text className="w-64 pt-2 text-base text-gray-dark">
        {t("chat_input.chat_input_empty") || "You don't have any message yet!"}
      </Text>
    </View>
  );
};

const ChatCoachTab: FC<IChatCoachTabProps> = ({
  challengeData,
  isChallengeInProgress,
}) => {
  const [messages, setMessages] = useState([]);
  const { t } = useTranslation();
  const { getUserProfile } = useUserProfileStore();
  const {
    getShouldDisplayNewMessageNotification,
    setShouldDisplayNewMessageNotification,
  } = useNotificationStore();
  const currentUser = getUserProfile();
  const sortByTime = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const dateA = new Date(a.createdAt) as any;
      const dateB = new Date(b.createdAt) as any;
      return dateB - dateA;
    });
    return sortedData;
  };

  const getMessage = () => {
    getMessageByChallengeId(challengeData.id).then((res) => {
      setMessages(
        sortByTime(
          res.data.map((item: any) => {
            return {
              _id: item.message.id,
              text: item.message.text,
              createdAt: item.message.createdAt,
              user: {
                _id: item.user.id,
                name: item.user.name,
                avatar: item.user.avatar,
                isCoach: item.message.coach,
              },
            };
          })
        )
      );
    });
  };

  useEffect(() => {
    getMessage();
    const intervalFetchApi = setInterval(getMessage, 20000);
    return () => {
      clearInterval(intervalFetchApi);
    };
  }, []);

  const handleSubmit = useCallback((messages) => {
    if (messages.length === 0 || !messages[0].text) {
      return;
    }
    sendMessage({
      text: messages[0].text,
      challenge: challengeData.id,
    }).then((res) => {
      getMessage();
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Screen was focused => Do nothing
      return () => {
        // Screen was unfocused => Enable new message notification if user go to another screen from chat tab
        const shouldDisplayNewMessageNotification =
          getShouldDisplayNewMessageNotification();
        if (!shouldDisplayNewMessageNotification)
          setShouldDisplayNewMessageNotification(true);
      };
    }, [])
  );

  return (
    <GiftedChat
      messagesContainerStyle={{
        paddingBottom: Platform.OS === "ios" ? 6 : 12,
      }}
      isCustomViewBottom
      messages={messages}
      onSend={(messages) => handleSubmit(messages)}
      renderSend={(props) => {
        return (
          <TouchableOpacity
            className="mb-3 mr-3 flex justify-center
                   "
            onPress={() => {
              props.onSend({ text: props.text.trim() }, true);
            }}
          >
            <SendIcon />
          </TouchableOpacity>
        );
      }}
      renderInputToolbar={(props) => (
        <>
          {isChallengeInProgress && (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: "white",
                borderColor: "#E8E8E8",
                paddingTop: 8,
                borderRadius: 10,
                borderWidth: 1,
                marginHorizontal: 20,
                marginBottom: Platform.OS === "ios" ? 0 : 16,
              }}
            />
          )}
        </>
      )}
      maxComposerHeight={100}
      placeholder={t("chat_input.chat_input_placeholder") || "Type a message"}
      user={{
        _id: currentUser?.id,
      }}
      renderTime={() => null}
      renderBubble={(props) => (
        <Bubble
          renderUsernameOnMessage
          renderUsername={(user) => (
            <Text className="absolute -bottom-4 left-0 text-sm font-light text-gray-dark">
              {user.name}
              {user?.isCoach && (
                <Text className="text-sm text-primary-default">Coach</Text>
              )}
            </Text>
          )}
          {...props}
          textStyle={{
            right: {
              color: "#000",
              padding: 6,
            },
            left: {
              color: "#000",
              padding: 6,
            },
          }}
          containerStyle={{
            right: {
              maxWidth: "80%",
              marginBottom: 10,
            },
            left: {
              maxWidth: "80%",
              marginBottom: 22,
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: "#fbe1d2",
              marginRight: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            },
            left: {
              backgroundColor: "#E7E9F1",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            },
          }}
        />
      )}
      renderAvatar={(props) => (
        <Avatar
          {...props}
          containerStyle={{
            left: {
              marginBottom: 16,
            },
          }}
          imageStyle={{
            left: {
              width: 34,
              height: 34,
              marginRight: -10,
            },
          }}
        />
      )}
      renderChatEmpty={() => <EmptyChatHolder />}
      scrollToBottom
      infiniteScroll
    />
  );
};

export default React.memo(ChatCoachTab);
