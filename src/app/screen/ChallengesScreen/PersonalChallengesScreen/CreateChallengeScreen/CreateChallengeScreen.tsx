import React, { useLayoutEffect, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import clsx from "clsx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useForm, Controller } from "react-hook-form";
import Spinner from "react-native-loading-spinner-overlay";
import { yupResolver } from "@hookform/resolvers/yup";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ICreateChallenge } from "../../../../types/challenge";
import { useNav } from "../../../../navigation/navigation.type";
import { CreateChallengeValidationSchema } from "../../../../Validators/CreateChallenge.validate";
import dayjs from "../../../../utils/date.util";
import {
  createChallenge,
  updateChallengeImage,
} from "../../../../service/challenge";
import Header from "../../../../component/common/Header";
import ErrorText from "../../../../component/common/ErrorText";
import ImagePicker from "../../../../component/common/ImagePicker";
import TextInput from "../../../../component/common/Inputs/TextInput";
import ConfirmDialog from "../../../../component/common/Dialog/ConfirmDialog";
import DateTimePicker2 from "../../../../component/common/BottomSheet/DateTimePicker2.tsx/DateTimePicker2";
import GlobalToastController from "../../../../component/common/Toast/GlobalToastController";
import httpInstance from "../../../../utils/http";
// import CalendarIcon from "./asset/calendar.svg";
// import CloseIcon from "../asset/close.svg";

interface ICreateChallengeForm
  extends Omit<ICreateChallenge, "achievementTime"> {
  achievementTime?: Date;
  image?: string;
}

const CreateChallengeScreen = () => {
  const onClose = () => {
    navigation.goBack();
  };
  const { t } = useTranslation();
  const navigation = useNav();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [isRequestSuccess, setIsRequestSuccess] = useState<boolean | null>(
    null
  );
  const [newChallengeId, setNewChallengeId] = useState<string | undefined>(
    undefined
  );
  const {
    control,
    getValues,
    setValue,

    handleSubmit,
    formState: { errors },
  } = useForm<ICreateChallengeForm>({
    defaultValues: {
      goal: "",
      benefits: "",
      reasons: "",
      achievementTime: undefined,
      image: "",
    },
    resolver: yupResolver(CreateChallengeValidationSchema()),
  });

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDatePicked = (date?: Date) => {
    if (date) {
      setValue("achievementTime", date, {
        shouldValidate: true,
      });
    }
    setShowDatePicker(false);
  };

  const handleImagesSelected = (images: string[]) => {
    setValue("image", images[0], {
      shouldValidate: true,
    });
  };

  const handleRemoveSelectedImage = (index: number) => {
    setValue("image", undefined, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: ICreateChallengeForm) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { image, ...rest } = data; // Images upload will be handle separately
      const payload = {
        ...rest,
        achievementTime: data.achievementTime as Date,
      };

      // Create a challenge without image
      const challengeCreateResponse = await createChallenge(payload);
      // If challenge created successfully, upload image
      if (
        challengeCreateResponse.status === 200 ||
        challengeCreateResponse.status === 201
      ) {
        setNewChallengeId(challengeCreateResponse.data.id);
        if (image) {
          const challengeImageResponse = await updateChallengeImage(
            {
              id: challengeCreateResponse.data.id,
            },
            image
          );

          if (
            challengeImageResponse.status === 200 ||
            challengeCreateResponse.status === 201
          ) {
            navigation.navigate("HomeScreen", {
              screen: "Challenges",
              params: {
                screen: "PersonalChallengeDetailScreen",
                params: {
                  challengeId: challengeCreateResponse.data.id,
                },
              },
            });
            GlobalToastController.showModal({
              message:
                t("toast.create_challenge_success") ||
                "Your challenge has been created successfully !",
            });
            // setIsRequestSuccess(true);
            // setIsShowModal(true);
            setIsLoading(false);
            return;
          }
          setIsRequestSuccess(false);
          setIsShowModal(true);
          httpInstance.delete(
            `/challenge/delete/${challengeCreateResponse.data.id}`
          );
          setErrorMessage(t("errorMessage:500") || "");
        }
        setIsRequestSuccess(true);
        setIsShowModal(true);
        // GlobalToastController.showModal({
        //   message:
        //     t('toast.create_challenge_success') ||
        //     'Employee deleted successfully!',
        // });
      }
    } catch (error) {
      setErrorMessage(t("errorMessage:500") || "");
    }
    setIsLoading(false);
  };

  const handleCloseModal = (newChallengeId: string | undefined) => {
    setIsShowModal(false);
    if (isRequestSuccess && newChallengeId) {
      onClose();

      navigation.navigate("HomeScreen", {
        screen: "Challenges",
        params: {
          screen: "PersonalChallengeDetailScreen",
          params: {
            challengeId: newChallengeId,
          },
        },
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text className="text-base font-normal text-primary-default">
            {t("new_challenge_screen.create_button").toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView>
        {isLoading && <Spinner visible={isLoading} />}
        <ConfirmDialog
          title={isRequestSuccess ? "Success" : "Error"}
          description={
            isRequestSuccess
              ? "Your challenge has been created successfully"
              : "Something went wrong. Please try again later."
          }
          isVisible={isShowModal}
          onClosed={() => handleCloseModal(newChallengeId)}
          closeButtonLabel="Got it"
        />
        <View className="mx-4 flex h-full rounded-t-xl bg-white">
          <View className="flex flex-col  py-5">
            <Text className="text-md font-normal leading-5 text-gray-dark">
              {t("new_challenge_screen.description")}
            </Text>
            {errorMessage && (
              <ErrorText
                containerClassName="justify-center "
                message={errorMessage}
              />
            )}
            <View className="pt-5">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("new_challenge_screen.your_goal") || ""}
                    placeholder={
                      t("new_challenge_screen.your_goal_placeholder") || ""
                    }
                    placeholderTextColor={"#6C6E76"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    className={clsx(errors.goal && "border-1 border-red-500")}
                  />
                )}
                name={"goal"}
              />
              {errors.goal ? <ErrorText message={errors.goal.message} /> : null}
            </View>
            <View className="pt-5">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t("new_challenge_screen.benefits") || ""}
                    placeholder={
                      t("new_challenge_screen.benefits_placeholder") || ""
                    }
                    placeholderTextColor={"#6C6E76"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    textAlignVertical="top"
                    value={value}
                    className={clsx(
                      "h-24",
                      errors.benefits && "border-1 border-red-500"
                    )}
                  />
                )}
                name={"benefits"}
              />
              {errors.benefits ? (
                <ErrorText message={errors.benefits.message} />
              ) : null}
            </View>

            <View className="pt-5">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      label={t("new_challenge_screen.reasons") || ""}
                      placeholder={
                        t("new_challenge_screen.reasons_placeholder") || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      multiline
                      textAlignVertical="top"
                      className={clsx(
                        "h-24",
                        errors.reasons && "border-1 border-red-500"
                      )}
                    />
                  </View>
                )}
                name={"reasons"}
              />
              {errors.reasons ? (
                <ErrorText message={errors.reasons.message} />
              ) : null}
            </View>

            <View className="mt-5">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput
                      label={t("new_challenge_screen.time_to_reach_goal") || ""}
                      placeholder={
                        t(
                          "new_challenge_screen.time_to_reach_goal_placeholder"
                        ) || ""
                      }
                      placeholderTextColor={"#6C6E76"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      editable={false}
                      value={value ? dayjs(value).format("DD/MM/YYYY") : ""}
                      rightIcon={
                        <MaterialCommunityIcons
                          name="calendar-month-outline"
                          size={24}
                          color="#FFF"
                        />
                      }
                      onPress={handleShowDatePicker}
                      className={clsx(
                        errors.achievementTime && "border-1 border-red-500"
                      )}
                    />
                    <DateTimePicker2
                      selectedDate={value as Date}
                      setSelectedDate={handleDatePicked}
                      setShowDateTimePicker={setShowDatePicker}
                      showDateTimePicker={showDatePicker}
                      minimumDate={new Date()}
                    />
                  </>
                )}
                name={"achievementTime"}
              />
              {errors.achievementTime ? (
                <ErrorText message={errors.achievementTime.message} />
              ) : null}
            </View>
            <View className="mt-5">
              <ImagePicker
                images={getValues("image") ? [getValues("image")!] : []}
                onImagesSelected={handleImagesSelected}
                onRemoveSelectedImage={handleRemoveSelectedImage}
                base64
              />
              {errors.image && <ErrorText message={errors.image.message} />}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default CreateChallengeScreen;