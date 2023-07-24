import React, { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { IHardSkill, IHardSkillProps } from "../../../../types/user";

import dayjs from "../../../../utils/date.util";

import {
  serviceGetListOccupation,
  serviceUpdateMyProfile,
} from "../../../../service/profile";
import { useGetUserData } from "../../../../hooks/useGetUser";
import { useUserProfileStore } from "../../../../store/user-store";

import Warning from "../../../../component/asset/warning.svg";
import TextInput from "../../../../component/common/Inputs/TextInput";
import PencilEditSvg from "../../../../component/asset/pencil-edit.svg";
import Button from "../../../../component/common/Buttons/Button";
import SelectPicker from "../../../../component/common/Pickers/SelectPicker";
import { EditProfileValidators } from "../../../../Validators/EditProfile.validate";
import AddHardSkills from "../../../../component/modal/AddHardSkills/AddHardSkills";
import DateTimePicker2 from "../../../../component/common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import { IOccupation } from "../../../../types/auth";
import CustomSwitch from "../../../../component/common/Switch";
import VideoPicker from "../../../../component/common/VideoPicker";
import { IUploadMediaWithId } from "../../../../types/media";
import { uploadNewVideo } from "../../../../utils/uploadVideo";
import { VideoWithPlayButton } from "../../../../component/Profile/ProfileTabs/Users/Biography/Biography";

import CalendarIcon from "./asset/calendar-icon.svg";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";

interface IEditPersonalProfileScreenProps {
  navigation: any;
}

interface IHardSkillSectionProps {
  setOpenModal: () => void;
  hardSkill: IHardSkill[];
  setArrayMyHardSkills: (value: IHardSkill[]) => void;
}

const HardSkillSection: FC<IHardSkillSectionProps> = ({
  setOpenModal,
  hardSkill,
}) => {
  const { t } = useTranslation();
  const handleOpenEditHardSkillModal = () => {
    setOpenModal();
  };
  return (
    <View className="flex flex-col items-start justify-start ">
      <View className="w-full flex-row items-center justify-between">
        <Text className="pr-2 text-base font-semibold text-primary-default">
          Hard skills
        </Text>
        <View className="w-6">
          <Button
            Icon={<PencilEditSvg />}
            onPress={handleOpenEditHardSkillModal}
          />
        </View>
      </View>
      <View className=" flex-col justify-between ">
        <View className="w-full flex-row flex-wrap justify-start">
          {hardSkill &&
            hardSkill.map((content, index) => {
              return (
                <Button
                  containerClassName="border-gray-light ml-1 border-[1px] mx-2 my-1.5  h-[48px] flex-none px-5"
                  textClassName="line-[30px] text-center text-md font-medium"
                  key={index}
                  title={content?.skill as string}
                />
              );
            })}
        </View>
      </View>
      {hardSkill.length < 3 && (
        <View className="flex flex-row pt-2">
          <Warning />
          <Text className="pl-1 text-sm font-normal text-red-500">
            {t("form_onboarding.screen_3.error") as string}
          </Text>
        </View>
      )}
    </View>
  );
};

const EditPersonalProfileScreen = ({ navigation }: any) => {
  const [occupationList, setOccupationList] = useState<IOccupation[]>([]);

  useEffect(() => {
    const getOccupationList = async () => {
      const { data } = await serviceGetListOccupation();
      setOccupationList(data);
    };
    getOccupationList();
  }, []);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [selectedOccupationIndex, setSelectedOccupationIndex] = useState<
    number | undefined
  >();
  const [isShowAddHardSkillModal, setIsShowAddHardSkillModal] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrDialog, setIsErrDialog] = useState(false);
  const { t } = useTranslation();

  const { getUserProfile } = useUserProfileStore();
  const userData = getUserProfile();
  useGetUserData();
  // const [isShowCompany, setIsShowCompany] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{
    name: string;
    surname: string;
    birth: Date | undefined | string;
    occupation: string;
    bio: string;
    hardSkill: IHardSkillProps[];
    isShowCompany: boolean;
  }>({
    defaultValues: {
      name: userData?.name || "",
      surname: userData?.surname || "",
      birth: userData?.birth || undefined,
      occupation: userData?.occupation?.name || "",
      bio: userData?.bio || "",
      hardSkill: userData?.hardSkill || [],
      isShowCompany: userData?.isShowCompany || false,
    },
    // TODO fix typescript
    resolver: yupResolver(EditProfileValidators()),
  });

  const [pickedVideo, setPickedVideo] = useState<IUploadMediaWithId[]>([]);
  const removeVideo = () => {
    uploadNewVideo("");
    setPickedVideo([]);
  };
  const occupation = getValues("occupation");
  const birth = getValues("birth");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue("birth", date);
      setSelectedDate(date);
    }
    setShowDateTimePicker(false);
  };

  const handleOccupationPicked = (index: number) => {
    if (index >= 0) {
      setSelectedOccupationIndex(index);
      setValue("occupation", occupationList[index].name);
    }
    setShowOccupationPicker(false);
  };
  const [arrayMyHardSkills, setArrayMyHardSkills] = useState<IHardSkill[]>([]);
  useEffect(() => {
    if (userData?.hardSkill) {
      const hardSkill = userData?.hardSkill.map((item) => {
        return {
          skill: item.skill.skill,
          id: item.skill.id,
        };
      });

      setArrayMyHardSkills(hardSkill);
    }
    // if (userData?.isShowCompany) {
    //   setIsShowCompany(userData?.isShowCompany);
    // }
  }, [userData?.hardSkill]);

  const onSubmit = async (data: any) => {
    const IdOccupation = occupationList.find(
      (item) => item.name === data.occupation
    )?.id;
    setIsLoading(true);
    try {
      await Promise.all([
        uploadNewVideo(pickedVideo[0]?.uri),
        serviceUpdateMyProfile(userData?.id, {
          name: data.name,
          surname: data.surname,
          bio: data.bio,
          birth: data.birth,
          occupation: IdOccupation,
          hardSkill: arrayMyHardSkills,
          isShowCompany: isShowCompany,
        }),
      ]);
      setIsLoading(false);
      GlobalToastController.showModal({
        message:
          t("dialog.update_profile_success") ||
          "Your profile update successfully!",
      });
      navigation.navigate("Profile");
    } catch (error) {
      setIsLoading(false);
      setIsErrDialog(true);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <KeyboardAwareScrollView>
        <View className="  h-full rounded-t-xl bg-white ">
          <ConfirmDialog
            title={t("dialog.err_title_update_profile") as string}
            description={t("dialog.err_update_profile") as string}
            isVisible={isErrDialog}
            onClosed={() => setIsErrDialog(false)}
            closeButtonLabel={t("close") || ""}
          />
          <AddHardSkills
            setIsShowAddHardSkillModal={setIsShowAddHardSkillModal}
            isVisible={isShowAddHardSkillModal}
            onClose={() => setIsShowAddHardSkillModal(false)}
            setArrayMyHardSkills={setArrayMyHardSkills}
            arrayMyHardSkills={arrayMyHardSkills}
            setValue={setValue}
          />
          <DateTimePicker2
            shouldMinus16Years
            selectedDate={selectedDate}
            setSelectedDate={handleDatePicked}
            setShowDateTimePicker={setShowDateTimePicker}
            showDateTimePicker={showDateTimePicker}
            maximumDate={dayjs().subtract(16, "years").startOf("day").toDate()}
            minimumDate={dayjs().subtract(100, "years").startOf("day").toDate()}
          />

          <SelectPicker
            title="Occupation"
            show={showOccupationPicker}
            data={occupationList}
            selectedIndex={selectedOccupationIndex}
            onSelect={handleOccupationPicked}
            onCancel={() => {
              setShowOccupationPicker(false);
            }}
          />

          {userData && (
            <View className=" h-full w-full px-4 pt-8 ">
              <View>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="flex flex-col">
                      <TextInput
                        label="First Name"
                        placeholder={"Enter your first name"}
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.name && (
                        <View className="flex flex-row pt-2">
                          <Warning />
                          <Text className="pl-1 text-sm font-normal text-red-500">
                            {errors.name.message}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>

              <View className="pt-3">
                <Controller
                  control={control}
                  name="surname"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="flex flex-col">
                      <TextInput
                        label="Last Name"
                        placeholder={"Enter your first name"}
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.surname && (
                        <View className="flex flex-row pt-2">
                          <Warning />
                          <Text className="pl-1 text-sm font-normal text-red-500">
                            {errors.surname.message}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
              <View className="pt-3">
                <Controller
                  control={control}
                  name="birth"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="flex flex-col">
                      <TextInput
                        label="Birthday"
                        placeholder={"Enter your birth day"}
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        rightIcon={
                          <TouchableOpacity
                            onPress={() => setShowDateTimePicker(true)}
                          >
                            <CalendarIcon />
                          </TouchableOpacity>
                        }
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value && dayjs(value).format("DD/MM/YYYY")}
                        // textAlignVertical="top"
                        editable={false}
                        onPress={() => setShowDateTimePicker(true)}
                        className="text-black-default"
                      />
                      {errors.birth && !birth && (
                        <View className="flex flex-row pt-2">
                          <Warning />
                          <Text className="pl-1 text-sm font-normal text-red-500">
                            {errors.birth.message}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
              <View className="pt-3">
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="flex flex-col">
                      <TextInput
                        label="Occupation"
                        placeholder={"Enter your occupation"}
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onPress={() => setShowOccupationPicker(true)}
                        value={value}
                      />
                      {errors.occupation && !occupation && (
                        <View className="flex flex-row pt-2">
                          <Warning />
                          <Text className="pl-1 text-sm font-normal text-red-500">
                            {errors.occupation.message}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>

              <View>
                <Text className="py-4 text-md font-semibold text-primary-default">
                  {t("video_profile")}
                </Text>
                {userData?.video && pickedVideo.length === 0 && (
                  <View className={clsx(" flex flex-col ")}>
                    <View>
                      <VideoWithPlayButton
                        src={userData?.video}
                        heightVideo={138}
                      />
                    </View>
                  </View>
                )}
                <VideoPicker
                  setExternalVideo={setPickedVideo}
                  useBigImage={true}
                  removeVideo={removeVideo}
                />
              </View>

              <View className="pt-3">
                <Controller
                  control={control}
                  name="bio"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="flex flex-col">
                      <TextInput
                        label="Biography"
                        placeholder={"Your biography"}
                        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        multiline={true}
                        numberOfLines={4}
                        // className="h-32"
                      />
                    </View>
                  )}
                />
              </View>

              <HardSkillSection
                setOpenModal={() => setIsShowAddHardSkillModal(true)}
                hardSkill={arrayMyHardSkills || []}
                setArrayMyHardSkills={setArrayMyHardSkills}
              />

              {userData?.employeeOf && (
                <>
                  <Text className="pt-4 text-base font-semibold text-primary-default">
                    {t("work_place")}
                  </Text>
                  <View className="flex flex-row items-center justify-between pt-2">
                    <Text className="text-base font-light">
                      {t("show_company")}
                    </Text>
                    <CustomSwitch
                      textDisable=""
                      textEnable=""
                      onValueChange={() => {
                        console.log("TODO update isShowCompany API");
                      }}
                      value={userData?.isShowCompany}
                    />
                  </View>
                </>
              )}

              <Button
                title="Update"
                containerClassName="mb-4  bg-primary-default mt-10 mb-"
                textClassName="text-white text-md leading-6"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditPersonalProfileScreen;