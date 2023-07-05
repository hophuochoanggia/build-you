import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import clsx from 'clsx';

import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

import Button from '../../../../common/Buttons/Button';
import PlayButton from './asset/play-button.svg';
import { IUserData } from 'apps/client/src/app/types/user';
interface IBiographyProps {
  userProfile: IUserData | null;
}
interface IVideoWithPlayButtonProps {
  src: string | undefined;
  heightVideo?: any;
}

export const VideoWithPlayButton = ({ src, heightVideo }: IVideoWithPlayButtonProps) => {
  const videoPlayer = React.useRef(null);
  const [status, setStatus] = React.useState<AVPlaybackStatus>(
    {} as AVPlaybackStatus
  );
  const [isVideoPlayed, setIsVideoPlayed] = React.useState(false);

  useEffect(() => {
    if (status && status.isLoaded) {
      if (status.isPlaying) {
        setIsVideoPlayed(true);
      }
    }
  }, [status]);
  //expo video doesn't support tailwind
  return (
    <View
      className={clsx('relative flex flex-col items-center justify-center bg-gray-200  rounded-xl')}
    >
      {src && (
        <Video
          ref={videoPlayer}
          source={{
            uri: src,
          }}
          style={{
            width: '100%',
            height: heightVideo || 200,
            backgroundColor: '#FFFFF',
            borderRadius: 12,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}
      {!isVideoPlayed && (
        <TouchableOpacity
          className={clsx('absolute translate-x-1/2 translate-y-1/2')}
          onPress={() => {
            (videoPlayer.current as any)?.playAsync();
          }}
        >
          <PlayButton />
        </TouchableOpacity>
      )}
    </View>
  );
};

const Biography = ({ userProfile }: IBiographyProps) => {

  const hardSkill = userProfile?.hardSkill;
  const bio = userProfile?.bio;
  const videoSrc = userProfile?.video;

  return (
    <ScrollView className='w-full px-4 '>
      <View className="justify-content: space-between pt-4 mb-[100px] w-full ">
        {videoSrc && videoSrc !== null && (
          <View className={clsx(' flex flex-col ')}>
            <View className={clsx('py-6')}>
              <VideoWithPlayButton src={videoSrc} />
            </View>
          </View>
        )}
        <Text className={clsx('text-h6 text-gray-dark')}>
          {bio ? bio : 'No biography yet'}
        </Text>
        {hardSkill && <View className="align-center mt-3 flex-row flex-wrap  ">
          {
            hardSkill.map((content, index) => {
              return (
                <Button
                  containerClassName="border-gray-light ml-1 border-[1px] mx-2 my-1.5  h-[48px] flex-none px-5"
                  textClassName="line-[30px] text-center text-md font-medium"
                  key={index}
                  title={content?.skill?.skill as string}
                />
              );
            })}
        </View>}
      </View>
    </ScrollView>
  );
};

export default Biography;