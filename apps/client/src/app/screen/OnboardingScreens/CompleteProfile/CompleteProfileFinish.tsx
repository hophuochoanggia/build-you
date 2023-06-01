import React, { FC } from 'react';
import { View, Text } from 'react-native';
import clsx from 'clsx';

import { CompleteProfileScreenNavigationProp } from './CompleteProfile';

import BuildYouLogo from './asset/buildYou_logo.svg';
import StarLogo from './asset/auto_awesome.svg';
import { useIsCompleteProfileStore } from '../../../store/is-complete-profile';

interface CompleteProfileFinishProps {
  navigation: CompleteProfileScreenNavigationProp;
}

const CompleteProfileFinish: FC<CompleteProfileFinishProps> = ({
  navigation,
}) => {

  const { setIsCompleteProfileStore } = useIsCompleteProfileStore();

  setTimeout(() => {
    setIsCompleteProfileStore(true);
  }, 2000);

  return (
    <View className="mt-28 flex h-full flex-col items-center">
      <View className="">
        <BuildYouLogo />
      </View>
      <View className="flex flex-col items-center justify-center pt-32">
        <StarLogo />

        <View>
          <Text className="text-gray-dark text-md mx-12 pt-4 text-center font-normal">
            Thank you for your information. We're personalizing your
            experience...
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CompleteProfileFinish;
