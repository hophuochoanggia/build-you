import clsx from "clsx";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import {
  NavigationProp,
  StackActions,
  useNavigation,
} from "@react-navigation/native";

import { ISoftSkill } from "../../../../types/challenge";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import MarkDone from "./assets/mark_done.svg";
import Empty from "./assets/emptyFollow.svg";

interface IParticipantsTabProps {
  participant?: {
    id: string;
    avatar: string;
    name: string;
    surname: string;
    challengeStatus?: string;
  }[];
  fetchParticipants?: () => void;
}

const ParticipantsTab: FC<IParticipantsTabProps> = ({
  participant = [],
  fetchParticipants,
}) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePushToOtherUserProfile = (userId: string) => {
    const pushAction = StackActions.push("OtherUserProfileScreen", {
      userId,
    });
    navigation.dispatch(pushAction);
  };

  return (
    <View className={clsx("flex-1 px-4")}>
      {participant.length > 0 && (
        <FlatList
          data={participant}
          className="pt-4"
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => handlePushToOtherUserProfile(item?.id)}
                className="mb-5 flex-row items-center justify-between gap-3"
              >
                <View className="flex-row items-center">
                  <View className="relative">
                    <Image
                      className="h-10 w-10 rounded-full"
                      source={require("../../../../common/image/avatar-load.png")}
                    />
                    {item?.avatar && (
                      <Image
                        source={{ uri: item.avatar.trim() }}
                        className={clsx(
                          "absolute left-0  top-0 h-10 w-10  rounded-full"
                        )}
                      />
                    )}
                  </View>
                  <Text className="ml-3 text-base font-semibold text-basic-black">
                    {item?.name} {item?.surname}
                  </Text>
                </View>
                <View className="pr-3">
                  {(item?.challengeStatus == "done" ||
                    item?.challengeStatus == "closed") && <MarkDone />}
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View className="h-20" />}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchParticipants && fetchParticipants();
            setRefreshing(false);
          }}
        />
      )}
      {participant.length == 0 && (
        <View className=" flex-1 items-center pt-16">
          <Empty />
          <Text className="text-h6 font-light leading-10 text-[#6C6E76]">
            {t("challenge_detail_screen.not_participants")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ParticipantsTab;
