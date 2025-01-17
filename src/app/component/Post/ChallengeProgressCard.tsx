import { View, Text } from "react-native";
import React, { useState } from "react";

import {
  INumberOfCommentUpdate,
  IProgressChallenge,
} from "../../types/challenge";

import { useGetOtherUserData } from "../../hooks/useGetUser";

import IconDot from "./asset/dot.svg";

import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import PostAvatar from "../common/Avatar/PostAvatar";
import ImageSwiper from "../common/ImageSwiper";
import { getTimeDiffToNow } from "../../utils/time";
import VideoPlayer from "../common/VideoPlayer";
import { useUserProfileStore } from "../../store/user-store";

interface IChallengeProgressCardProps {
  progress: IProgressChallenge;
  ownerId?: string;
  localCommentUpdate?: INumberOfCommentUpdate;
}

const ChallengeProgressCardForComment: React.FC<
  IChallengeProgressCardProps
> = ({
  progress: {
    id,
    caption,
    createdAt,
    challenge,
    comments,
    image,
    video,
    location,
  },
  ownerId,
  localCommentUpdate,
}) => {
  const [otherData, setOtherData] = useState<any>();
  ownerId && useGetOtherUserData(ownerId, setOtherData);
  const { getUserProfile } = useUserProfileStore();
  const currentUser = getUserProfile();

  return (
    <View className="mb-1 flex-1 bg-white p-5">
      <View className="mb-3 flex-1 flex-row justify-between">
        <View className="flex-1 flex-row">
          <PostAvatar src={otherData?.avatar} />
          <View className="ml-2 flex-1">
            <Text className="text-h6 font-bold">
              {otherData?.name} {otherData?.surname}
            </Text>

            <View className="mr-20 flex-1 flex-row gap-3">
              <Text className="text-xs font-light text-gray-dark ">
                {getTimeDiffToNow(createdAt)}
              </Text>

              {location && (
                <View className="flex flex-row">
                  <Text className="text-xs font-light text-gray-dark ">
                    <IconDot fill={"#7D7E80"} />
                    {"  "}
                  </Text>
                  <Text className="mr-6 text-xs font-light text-gray-dark">
                    {location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className="py-2 pb-3">
        <Text className="text-md font-normal">{caption}</Text>
      </View>

      {image?.length > 0 && (
        <View className="aspect-square w-full">
          <ImageSwiper imageSrc={image} />
        </View>
      )}
      {video && <VideoPlayer src={video.trim()} />}
      <View className="mt-4 flex-row">
        <LikeButton progressId={id} currentUserId={currentUser?.id} />
        <CommentButton
          isViewOnly={true}
          progressId={id}
          localCommentUpdate={localCommentUpdate}
        />
      </View>
    </View>
  );
};

export default ChallengeProgressCardForComment;
