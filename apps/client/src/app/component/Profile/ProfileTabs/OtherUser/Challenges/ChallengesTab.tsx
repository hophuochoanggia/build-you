import React, { FC, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  NavigationProp,
  StackActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';

import { getChallengeByUserId } from '../../../../../service/challenge';
import { IChallenge } from '../../../../../types/challenge';
import ChallengeCard from '../../../../Card/ChallengeCard/ChallengeCard';
import { RootStackParamList } from '../../../../../navigation/navigation.type';
import GolbalDialogController from '../../../../common/Dialog/GlobalDialogController';
import { sortChallengeByStatus } from 'apps/client/src/app/utils/common';

interface IChallengesTabProps {
  userId: string | null | undefined;
  isCurrentUserInCompany?: boolean | null;
  isCompanyAccount: boolean | undefined | null;
}

const ChallengesTab: FC<IChallengesTabProps> = ({
  userId,
  isCompanyAccount = false,
  isCurrentUserInCompany = null,
}) => {
  const { t } = useTranslation();
  const [otherUserChallenge, setOtherUserChallenge] = React.useState<
    IChallenge[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!userId || isCurrentUserInCompany == null) return;
    setIsLoading(true);
    getChallengeByUserId(userId)
      .then((res) => {
        if (!isCurrentUserInCompany) {
          res.data = res.data.filter((item: any) => item?.public);
        }
        setOtherUserChallenge(sortChallengeByStatus(res));
      })
      .catch((err) => {
        GolbalDialogController.showModal({
          title: 'Error',
          message: 'Something went wrong. Please try again later.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId, isCurrentUserInCompany, isFocused]);

  if (!userId) {
    return (
      <View>
        <Text>{t('error_general_message')}</Text>
      </View>
    );
  }

  const handleNavigateToChallengeDetail = (challengeId: string) => {
    const pushAction = StackActions.push('OtherUserProfileChallengeDetailsScreen', {
      challengeId,
      isCompanyAccount: isCompanyAccount ? true : false,
    });
    navigation.dispatch(pushAction);
  };

  return (
    <View className="h-full  px-4">
      {otherUserChallenge.length > 0 && (
        <FlatList
          className="px-4 pt-4"
          data={otherUserChallenge}
          renderItem={({ item }: { item: IChallenge }) => (
            <ChallengeCard
              item={item}
              isCompanyAccount={isCompanyAccount}
              isFromOtherUser
              imageSrc={`${item.image}`}
              handlePress={() => handleNavigateToChallengeDetail(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {otherUserChallenge.length === 0 && !isLoading && (
        <View className=" h-full w-full flex-1 items-center justify-center pt-44">
          <Text className="text-lg text-gray-400 ">
            {t('company_profile_screen.no_challenge')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ChallengesTab;
