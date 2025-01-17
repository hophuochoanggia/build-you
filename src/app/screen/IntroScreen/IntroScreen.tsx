import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Image } from "expo-image";

import { useTranslation } from "react-i18next";
import Swiper from "react-native-swiper";
import Button from "../../component/common/Buttons/Button";

import RegisterModal from "../../component/modal/RegisterModal/RegisterModal";

export const IntroScreen = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  // const [modalVisible, setModalVisible] = useState(false);
  // useEffect(() => {
  //   if (route?.params?.setModal) {
  //     setModalVisible(route?.params?.setModal);
  //   }
  // }, []);

  return (
    <View
      className="justify-content: space-between flex-1"
      testID="intro_screen"
    >
      <View className="flex-1">
        <Image
          className="z-10 h-[100%] w-[100%] rounded-xl"
          source={require("./asset/banner.png")}
          contentFit="cover"
        />
        <Image
          className="position: absolute bottom-7 left-[34%] z-20"
          source={require("./asset/logo.png")}
          contentFit="cover"
        />
        <View className="position: absolute top-3 h-[100%] w-[100%] rounded-xl bg-[#FF7B1C] opacity-40" />
        <View className="position: absolute top-5 h-[100%] w-[100%] rounded-xl bg-[#FFA41B] opacity-30" />
      </View>
      <View className="mb-7 mt-7 h-[350px] items-center justify-between p-5">
        <Text className="line-[30px] mb-5 text-center text-[21px] font-medium">
          {t("login_screen.title")}
        </Text>

        <View className="h-[120px]">
          <Swiper className="justify-center">
            <Text className="line-[22.4px] text-center text-[16px] font-normal text-[#90969E]">
              {t("login_screen.description1")}
            </Text>
            <Text className="line-[22.4px] text-center text-[16px] font-normal text-[#90969E]">
              {t("login_screen.description2")}
            </Text>
            <Text className="line-[22.4px] text-center text-[16px] font-normal text-[#90969E]">
              {t("login_screen.description3")}
            </Text>
          </Swiper>
        </View>

        <View className="w-full flex-row">
          <Button
            testID="intro_register_btn"
            title={t("login_screen.register")}
            containerClassName="bg-primary-default"
            textClassName="text-white"
            onPress={() => navigation.navigate("RegisterModal")}
          />
          <Button
            testID="intro_login_btn"
            title={t("login_screen.login")}
            containerClassName="border-primary-default border-[1px] ml-1"
            textClassName="text-primary-default"
            onPress={() => navigation.navigate("LoginScreen")}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("HomeScreenWithoutLogin")}
        >
          <Text className="text-[#90969E]">
            {t("login_screen.explore_no_account")}
          </Text>
        </TouchableOpacity>

        {/* <RegisterModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        /> */}
      </View>
    </View>
  );
};

export default IntroScreen;
