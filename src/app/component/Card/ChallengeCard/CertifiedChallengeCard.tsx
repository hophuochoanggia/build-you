import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import clsx from "clsx";
import { Image } from "expo-image";

import { IChallenge, IChallengeOwner } from "../../../types/challenge";
import {
  getChallengeStatusColor,
  roundToDecimalOrWhole,
} from "../../../utils/common";

import CheckCircle from "../../asset/check_circle.svg";
import BackSvg from "../../asset/back.svg";
import { CertifiedChallengeTag, CompanyTag } from "./ChallengeCard";
import { useUserProfileStore } from "../../../store/user-store";
import { StackActions } from "@react-navigation/native";
import { serviceGetChallengeRating } from "../../../service/challenge";

import StarFillSvg from "../../../common/svg/star-fill.svg";
import { useChallengeUpdateStore } from "../../../store/challenge-update-store";

interface ICertifiedChallengeCardProps {
  item: IChallenge;
  imageSrc: string | null | undefined;
  navigation?: any;
}

const CertifiedChallengeCard: React.FC<ICertifiedChallengeCardProps> = ({
  item,
  imageSrc,
  navigation,
}) => {
  const [ratedValue, setRatedValue] = useState<number>(0);

  const challengeOwner = Array.isArray(item?.owner)
    ? item?.owner[0]
    : item?.owner;
  const companyName = challengeOwner.companyAccount && challengeOwner?.name;

  const { getChallengeRatingUpdate } = useChallengeUpdateStore();
  const challengeRatingUpdate = getChallengeRatingUpdate();

  const isCertifiedChallenge = item?.type === "certified";
  const challengeStatus = item.status;

  const onPress = () => {
    if (navigation) {
      const action = StackActions.push("PersonalCoachChallengeDetailScreen", {
        challengeId: item.id,
      });
      navigation.dispatch(action);
      return;
    }
  };

  useEffect(() => {
    const fetchChallengeRating = async () => {
      try {
        const res = await serviceGetChallengeRating(item?.id);
        const rating = res.data?.rateAverage;
        setRatedValue(rating);
      } catch (_) {
        setRatedValue(0);
      }
    };
    fetchChallengeRating();
  }, []);

  useEffect(() => {
    if (challengeRatingUpdate?.id === item?.id) {
      setRatedValue(challengeRatingUpdate?.rating);
    }
  }, [challengeRatingUpdate?.id]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={clsx("mb-5 w-full rounded-xl border border-gray-80 bg-white")}
    >
      <View className={clsx("relative w-full")}>
        {companyName && (
          <View className={clsx("absolute top-6 z-10 flex w-full items-end")}>
            <CompanyTag companyName={companyName} />
          </View>
        )}
        {isCertifiedChallenge && (
          <View
            className={clsx(
              "absolute left-4 top-6 z-10 flex w-full items-start"
            )}
          >
            <CertifiedChallengeTag />
          </View>
        )}
        {imageSrc && (
          <Image
            className={clsx("aspect-square w-full rounded-t-xl")}
            source={{ uri: imageSrc }}
          />
        )}
        <View
          className={clsx(
            "flex flex-row items-center justify-between px-4 py-3"
          )}
        >
          <View className={clsx("flex-1 flex-row items-center")}>
            <CheckCircle
              fill={getChallengeStatusColor(challengeStatus, item.status)}
            />
            <View className="flex-1">
              <Text className={clsx("pl-2 text-h6 font-semibold leading-6")}>
                {item?.goal}
              </Text>
            </View>
          </View>
          <View className={clsx("flex flex-row items-end")}>
            {ratedValue > 0 && (
              <View className={clsx("mr-4 flex flex-row items-center")}>
                <Text className={clsx("mr-1 text-h6 font-semibold leading-6")}>
                  {roundToDecimalOrWhole(ratedValue)}/{5}
                </Text>
                <StarFillSvg width={18} height={18} />
              </View>
            )}
            <BackSvg />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CertifiedChallengeCard;
