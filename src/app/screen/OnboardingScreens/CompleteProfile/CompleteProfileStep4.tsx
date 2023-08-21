import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

import clsx from "clsx";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import Checkbox from "expo-checkbox";

import { useCompleteProfileStore } from "../../../store/complete-user-profile";
import { useUserProfileStore } from "../../../store/user-store";

import { useGetUserData } from "../../../hooks/useGetUser";

import StepOfSteps from "../../../component/common/StepofSteps";
import { CompleteProfileScreenNavigationProp } from "./CompleteProfile";
import Button from "../../../component/common/Buttons/Button";

import CheckedSvg from "./asset/checked.svg";
import UncheckedSvg from "./asset/uncheck.svg";
import WarningSvg from "../../../component/asset/warning.svg";

import httpInstance from "../../../utils/http";
import { uploadNewVideo } from "../../../utils/uploadVideo";
import GlobalDialogController from "../../../component/common/Dialog/GlobalDialogController";
import i18n from "../../../i18n/i18n";

interface CompleteProfileStep4Props {
  navigation: CompleteProfileScreenNavigationProp;
}

interface IFetchedSkill {
  id: string;
  skill: string;
}
interface ISkillProps {
  skill: IFetchedSkill;
  rating: number;
}

interface IFormValueInput {
  label: string;
  value: number; //rating
  id: string;
  testID?: string;
}

interface IRenderSoftSkillProgress {
  item: IFormValueInput;
  changeSkillValue: any;
  skillValueError: boolean;
}

const NUMBER_OF_SKILL_REQUIRED = 3;
const MAX_PROGRESS_VALUE = 5;

const renderSoftSkillProgress: FC<IRenderSoftSkillProgress> = ({
  item,
  changeSkillValue,
  skillValueError,
}) => {
  const randomId = Math.random().toString();
  console.log(`${item.testID}_progress_${3}`);
  return (
    <View className="flex w-full flex-col">
      <View className="flex w-full flex-row items-center justify-between">
        <View>
          <Text className="w-44 text-h6 font-medium leading-6 text-black-default">
            {item.label}
          </Text>
        </View>
        <View className="flex flex-1 flex-row  justify-end">
          {Array.from(Array(MAX_PROGRESS_VALUE).keys()).map((_, index) => (
            <TouchableOpacity
              className="pr-4"
              key={`${randomId}${index}`}
              onPress={() => changeSkillValue(item?.label, index + 1)}
              testID={`${item.testID}_progress_${index}`}
            >
              {index < item?.value ? (
                <CheckedSvg />
              ) : (
                <UncheckedSvg className="text-gray-light" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {skillValueError && item?.value === 0 && (
        <View className="flex flex-row items-center">
          <WarningSvg />
          <Text
            className="pl-1 text-sm text-red-500"
            testID={`${item.testID}_error`}
          >
            {i18n.t("form_onboarding.screen_4.error_rate") ||
              "Please rate from 1 to 5"}
          </Text>
        </View>
      )}
    </View>
  );
};

const renderSelectedSoftSkill = (
  selectedCompetencedSkill: IFormValueInput[],
  changeSkillValue: any,
  skillValueError: boolean
) => {
  const randomId = Math.random().toString();
  return (
    <View className="flex flex-col flex-wrap">
      {selectedCompetencedSkill.map((item, index) => (
        <View className="pb-6" key={`${randomId}${index}`}>
          {renderSoftSkillProgress({ item, changeSkillValue, skillValueError })}
        </View>
      ))}
    </View>
  );
};

const convertFetchedSoftSkillToSkillProps = (
  fetchedSoftSkills: IFetchedSkill[]
): IFormValueInput[] => {
  return fetchedSoftSkills.map((item, index) => ({
    label: item?.skill,
    value: 0,
    id: item?.id,
    testID: `soft_skill_dropdown_picker_item_${index}`
  }));
};

const convertSelectedToSoftSkillProps = (
  selectedCompetencedSkill: IFormValueInput[]
): ISkillProps[] => {
  return selectedCompetencedSkill.map((item) => ({
    skill: {
      id: item?.id,
      skill: item?.label,
    },
    rating: item?.value,
  }));
};

const CompleteProfileStep4: FC<CompleteProfileStep4Props> = ({
  navigation,
}) => {
  const { t } = useTranslation();

  const [selectedCompetencedSkill, setSelectedCompetencedSkill] = useState<
    IFormValueInput[]
  >([]);
  const [numberOfSkillError, setNumberOfSkillError] = useState<boolean>(false);
  const [skillValueError, setSkillValueError] = useState<boolean>(false);

  const { setSoftSkills, getProfile } = useCompleteProfileStore();
  const { setUserProfile, getUserProfileAsync } = useUserProfileStore();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>([]);

  const [fetchedSoftSkills, setFetchedSoftSkills] = useState<IFormValueInput[]>(
    []
  );

  useGetUserData();
  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await httpInstance.get("/skill/soft/list");
        setFetchedSoftSkills(
          convertFetchedSoftSkillToSkillProps(response.data)
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);

  const checkAllSkillValueGreaterThanZero = () => {
    const isGreaterThanZero = selectedCompetencedSkill.every(
      (item) => item.value > 0
    );
    if (!isGreaterThanZero) {
      setSkillValueError(true);
    }
    return isGreaterThanZero;
  };

  const changeSkillValue = (skill: string, value: number) => {
    const newSelectedCompetencedSkill = selectedCompetencedSkill.map((item) => {
      if (item.label === skill) {
        return {
          ...item,
          value,
        };
      }
      return item;
    });
    setSelectedCompetencedSkill(newSelectedCompetencedSkill);
  };

  const checkSoftSkillRequired = () => {
    if (selectedCompetencedSkill.length < NUMBER_OF_SKILL_REQUIRED) {
      setNumberOfSkillError(true);
      return false;
    }
    setNumberOfSkillError(false);
    return true;
  };

  const handleSubmitForm = async () => {
    setOpenDropdown(false);
    setSoftSkills(selectedCompetencedSkill);
    const profile = getProfile();
    if (!checkSoftSkillRequired() || !checkAllSkillValueGreaterThanZero())
      return;
    const softSkills = convertSelectedToSoftSkillProps(
      selectedCompetencedSkill
    );

    if (!userData?.id) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
        button: t("dialog.ok"),
      });
      return;
    }
    try {
      await Promise.all([
        uploadNewVideo(profile?.video),
        httpInstance.put(`/user/update/${userData.id}`, {
          name: profile?.name,
          surname: profile?.surname,
          birth: profile?.birth,
          occupation: profile?.occupation,
          bio: profile?.biography,
          softSkill: softSkills,
          hardSkill: profile.skills,
          company: "",
        }),
      ]);
      await getUserProfileAsync();
      navigation.navigate("CompleteProfileFinishScreen");
    } catch (error) {
      GlobalDialogController.showModal({
        title: t("dialog.err_title"),
        message:
          (t("error_general_message") as string) || "Something went wrong",
      });
    }
  };

  const addCompetencedSkill = (skill: IFormValueInput | undefined) => {
    if (!skill) return;
    const isSkillAlreadySelected = selectedCompetencedSkill.find(
      (item) => item.label === skill.label
    );
    if (isSkillAlreadySelected) {
      const newSelectedCompetencedSkill = selectedCompetencedSkill.filter(
        (item) => item.label !== skill.label
      );
      setSelectedCompetencedSkill(newSelectedCompetencedSkill);
      return;
    }
    setSelectedCompetencedSkill([...selectedCompetencedSkill, skill]);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpenDropdown(false)}>
      <ScrollView showsVerticalScrollIndicator testID="complete_profile_step_4">
        <View>
          <StepOfSteps step={4} totalSteps={4} />
        </View>
        <View className="px-16 py-6">
          <Text className="text-center text-h4 font-semibold leading-6 text-black-default">
            {t("form_onboarding.screen_4.title") ||
              "Select the soft skills you are already competent on"}
          </Text>
          <Text className="pt-2 text-center text-h6 font-normal leading-5 text-gray-dark">
            {t("form_onboarding.screen_4.sub_title") ||
              "Please select at least 3 different soft skills and rate it from 1 to 5."}
          </Text>
        </View>

        <View className="flex w-full pt-5 ">
          <View className="flex flex-col px-5">
            <Text className="pb-2 text-md font-semibold text-primary-default">
              {t("form_onboarding.screen_4.soft_skills") || "Soft skills"}
            </Text>

            <DropDownPicker
              testID="soft_skill_dropdown_picker"
              open={openDropdown}
              value={value}
              items={fetchedSoftSkills}
              setOpen={setOpenDropdown}
              setValue={setValue}
              onPress={setOpenDropdown}
              setItems={setFetchedSoftSkills}
              placeholder={
                selectedCompetencedSkill.length == 0
                  ? t("form_onboarding.screen_4.select_soft_skill") ||
                    "Select a soft skill"
                  : `${selectedCompetencedSkill.length}/${fetchedSoftSkills.length}`
              }
              style={{
                backgroundColor: "#fafafa",
                borderColor: "#e2e8f0",
                borderWidth: 1,
                borderRadius: 8,
                height: 48,
                zIndex: 10,
              }}
              containerStyle={{
                width: "100%",
                backgroundColor: "#fafafa",
                zIndex: 10,
              }}
              dropDownContainerStyle={{
                backgroundColor: "#fafafa",
                borderColor: "#e2e8f0",
                borderWidth: 1,
                borderRadius: 8,
                maxHeight: 300,
                overflow: "scroll",
                zIndex: 10,
              }}
              theme="LIGHT"
              multiple={true}
              mode="SIMPLE"
              badgeDotColors={["#e76f51"]}
              renderListItem={({ item, isSelected }) => {
                const isSkillAlreadySelected = selectedCompetencedSkill.find(
                  (selected) => selected.label === item.label
                );
                const randomIndex = Math.random().toString().replace(".", "");
                return (
                  <TouchableOpacity
                    onPress={() => addCompetencedSkill(item as IFormValueInput)}
                    key={randomIndex}
                    testID={item.testID}
                  >
                    <View
                      className={clsx(
                        "flex-row items-center justify-start px-4 py-3",
                        {
                          "bg-gray-light": isSelected,
                        }
                      )}
                    >
                      <Checkbox
                        value={!!isSkillAlreadySelected}
                        onValueChange={() =>
                          addCompetencedSkill(item as IFormValueInput)
                        }
                        color={isSelected ? "#4630EB" : undefined}
                      />
                      <Text
                        key={item.label}
                        className="pl-3 text-h6 font-medium leading-6 text-black-default"
                      >
                        {item.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <View>
              {numberOfSkillError && (
                <View className="flex flex-row items-center justify-start pt-2">
                  <WarningSvg />
                  <Text
                    className="pl-1 text-sm font-normal leading-5 text-red-500"
                    testID="complete_profile_step_4_error"
                  >
                    {t("form_onboarding.screen_4.error") ||
                      "Please select at least 3 soft skills."}
                  </Text>
                </View>
              )}
            </View>
            <View className="w-full flex-col justify-between pt-5">
              {renderSelectedSoftSkill(
                selectedCompetencedSkill,
                changeSkillValue,
                skillValueError
              )}
            </View>
          </View>
        </View>
        {!openDropdown && (
          <Button
            testID="complete_profile_step_4_next_button"
            title={t("button.next") || "Next"}
            containerClassName=" bg-primary-default my-5 mx-5 "
            textClassName="text-white text-md leading-6"
            onPress={() => handleSubmitForm()}
          />
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default CompleteProfileStep4;
