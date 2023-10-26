import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { SafeAreaView, View, Text } from "react-native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Spinner from "react-native-loading-spinner-overlay";
import { useTranslation } from "react-i18next";

import { onShareChallengeLink } from "../../../../utils/shareLink.uitl";

import {
  ICertifiedChallengeState,
  IChallenge,
} from "../../../../types/challenge";
import { RootStackParamList } from "../../../../navigation/navigation.type";

import Button from "../../../../component/common/Buttons/Button";

import ShareIcon from "../assets/share.svg";

import ProgressTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/ProgressTab";
import DescriptionTab from "../../PersonalChallengesScreen/ChallengeDetailScreen/DescriptionTab";
import CoachTab from "./CoachTab";
import CoachSkillsTab from "./CoachSkillsTab";
import ChatCoachTab from "./ChatCoachTab";
import { getChallengeById } from "../../../../service/challenge";
import { useNotificationStore } from "../../../../store/notification-store";
import { isObjectEmpty } from "../../../../utils/common";
import CustomTabView from "../../../../component/common/Tab/CustomTabView";
import { CHALLENGE_TABS_KEY } from "../../../../common/enum";
import CompanySkillsTab from "./CompanySkillsTab";
import { useTabIndex } from "../../../../hooks/useTabIndex";
import CompanyCoachCalendarTabCoachView from "../../CompanyChallengesScreen/ChallengeDetailScreen/CompanyCoachCalendarTabCoachView";
import IndividualCoachCalendarTab from "../../../../component/IndividualCoachCalendar/IndividualCoachCalendarTab";

type CoachChallengeDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PersonalCoachChallengeDetailScreen"
>;

interface IRightCoachChallengeDetailOptionsProps {
  challengeId: string;
}

export const RightCoachChallengeDetailOptions: FC<
  IRightCoachChallengeDetailOptionsProps
> = ({ challengeId }) => {
  const onShare = () => {
    onShareChallengeLink(challengeId);
  };
  return (
    <View>
      <View className="-mt-1 flex flex-row items-center">
        <View className="pl-4 pr-2">
          <Button Icon={<ShareIcon />} onPress={onShare} />
        </View>
      </View>
    </View>
  );
};

const PersonalCoachChallengeDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: CoachChallengeDetailScreenNavigationProp;
}) => {
  const [challengeData, setChallengeData] = useState<IChallenge>(
    {} as IChallenge
  );
  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);
  const [challengeState, setChallengeState] =
    useState<ICertifiedChallengeState>({} as ICertifiedChallengeState);

  const challengeId = route?.params?.challengeId;

  const isCompanyChallenge = challengeData?.owner?.[0].companyAccount;

  const { t } = useTranslation();
  const [tabRoutes, setTabRoutes] = useState([
    {
      key: CHALLENGE_TABS_KEY.PROGRESS,
      title: t("challenge_detail_screen.progress"),
    },
    {
      key: CHALLENGE_TABS_KEY.DESCRIPTION,
      title: t("challenge_detail_screen.description"),
    },
    {
      key: CHALLENGE_TABS_KEY.COACH,
      title: t("challenge_detail_screen.coach"),
    },
    {
      key: CHALLENGE_TABS_KEY.SKILLS,
      title: t("challenge_detail_screen.skills"),
    },
  ]);

  const { index, setTabIndex } = useTabIndex({ tabRoutes, route });

  const isChallengeInProgress =
    (!isObjectEmpty(challengeState) &&
      challengeState.intakeStatus === "in-progress") ||
    challengeState.checkStatus === "in-progress" ||
    challengeState.closingStatus === "in-progress";

  const isChallengeCompleted = challengeData.status === "closed";
  const isChatChallenge = challengeData?.package?.type === "chat";
  const isVideoChallenge = challengeData?.package?.type === "videocall";

  useLayoutEffect(() => {
    // Set header options, must set it manually to handle the onPress event inside the screen
    navigation.setOptions({
      headerRight: () => (
        <RightCoachChallengeDetailOptions challengeId={challengeId} />
      ),
    });
  }, []);

  const getChallengeData = async () => {
    setIsScreenLoading(true);
    try {
      await getChallengeById(challengeId).then((res) => {
        setChallengeData(res.data);
      });
    } catch (error) {
      console.log("CoachChallengeDetailScreen - Error fetching data:", error);
    }
    setIsScreenLoading(false);
  };

  useEffect(() => {
    getChallengeData();
  }, []);

  useEffect(() => {
    const tempTabRoutes = [...tabRoutes];
    if (isVideoChallenge) {
      if (
        !tempTabRoutes.find(
          (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.COACH_CALENDAR
        )
      ) {
        tempTabRoutes.push({
          key: CHALLENGE_TABS_KEY.COACH_CALENDAR,
          title: t("challenge_detail_screen.coach_calendar"),
        });
      }
    } else if (isChatChallenge) {
      if (
        !tempTabRoutes.find(
          (tabRoute) => tabRoute.key === CHALLENGE_TABS_KEY.CHAT
        )
      ) {
        tempTabRoutes.push({
          key: CHALLENGE_TABS_KEY.CHAT,
          title: t("challenge_detail_screen.chat_coach"),
        });
      }
    }
    setTabRoutes(tempTabRoutes);
  }, [isVideoChallenge, isChatChallenge]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case CHALLENGE_TABS_KEY.PROGRESS:
        return (
          <ProgressTab
            isJoined={false}
            isChallengeCompleted={false}
            challengeData={challengeData}
          />
        );
      case CHALLENGE_TABS_KEY.DESCRIPTION:
        return <DescriptionTab challengeData={challengeData} />;
      case CHALLENGE_TABS_KEY.COACH:
        return (
          <CoachTab
            coachID={challengeData?.coach}
            challengeId={challengeId}
            challengeState={challengeState}
            setChallengeState={setChallengeState}
            isChallengeCompleted={isChallengeCompleted}
          />
        );
      case CHALLENGE_TABS_KEY.SKILLS:
        return (
          <>
            {isCompanyChallenge ? (
              <CompanySkillsTab
                challengeData={challengeData}
                challengeState={challengeState}
              />
            ) : (
              <CoachSkillsTab
                challengeData={challengeData}
                challengeState={challengeState}
              />
            )}
          </>
        );
      case CHALLENGE_TABS_KEY.CHAT:
        return (
          <>
            {challengeData?.type === "certified" && (
              <ChatCoachTab
                challengeData={challengeData}
                isChallengeInProgress={isChallengeInProgress}
              />
            )}
          </>
        );
      case CHALLENGE_TABS_KEY.COACH_CALENDAR:
        return (
          <>
            {isCompanyChallenge ? (
              <CompanyCoachCalendarTabCoachView />
            ) : (
              <IndividualCoachCalendarTab
                isCoach={true}
                isChallengeInProgress
              />
            )}
          </>
        );
    }
  };

  return (
    <SafeAreaView className="bg-[#FAFBFF]">
      {isScreenLoading && <Spinner visible={isScreenLoading} />}
      <View className="flex h-full flex-col bg-white pt-2">
        <View className="flex flex-row items-center justify-between px-4">
          <View className="flex-1 flex-row items-center gap-2 pb-2 pt-2">
            <View className="flex-1">
              <Text className="text-2xl font-semibold">
                {challengeData?.goal}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-2 flex flex-1 bg-gray-veryLight">
          <CustomTabView
            routes={tabRoutes}
            renderScene={renderScene}
            index={index}
            setIndex={setTabIndex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PersonalCoachChallengeDetailScreen;