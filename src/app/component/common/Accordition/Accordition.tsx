import React from "react";
import { View, Text } from "react-native";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import AccorditionItem from "./AccorditionItem";

interface IAccorditionProps {
  navigation: any;
}
const Accordition = ({ navigation }: IAccorditionProps) => {
  const { t } = useTranslation();

  return (
    <View>
      {/* <View className={clsx("flex flex-col pt-3")}>
        <View className={clsx("py-4")}>
          <Text className={clsx("text-h4 font-medium")}>
            {t("user_settings_screen.general_settings")}
          </Text>
        </View>
        <View>
          <Text className={clsx("text-h6 font-normal leading-6")}>
            {t("user_settings_screen.general_settings_description")}
          </Text>
        </View>
        <AccorditionItem
          title={t(
            "user_settings_screen.general_settings_sections.cookie_regulation"
          )}
        />
        <AccorditionItem
          title={t(
            "user_settings_screen.general_settings_sections.preferences"
          )}
        />
        <AccorditionItem
          title={t(
            "user_settings_screen.general_settings_sections.community_standards"
          )}
        />
        <AccorditionItem
          title={t(
            "user_settings_screen.general_settings_sections.notifications"
          )}
        />
      </View> */}
      <View className={clsx("flex flex-col pt-4")}>
        <View className={clsx("py-4")}>
          <Text className={clsx("text-h4 font-medium")}>
            {t("user_settings_screen.account")}
          </Text>
        </View>
        <View>
          <Text className={clsx("text-h6 font-normal leading-6")}>
            {t("user_settings_screen.account_settings_description")}
          </Text>
        </View>
        <AccorditionItem
          title={t(
            "user_settings_screen.account_settings_sections.personal_information"
          )}
          onPress={() => navigation.navigate("PersonalInformationScreen")}
        />
        <AccorditionItem
          title={t(
            "user_settings_screen.account_settings_sections.terms_of_services"
          )}
          onPress={() => navigation.navigate("TermsOfServicesScreen")}
        />
        <AccorditionItem
          title={t(
            "user_settings_screen.account_settings_sections.privacy_policy"
          )}
          onPress={() => navigation.navigate("PrivacyPolicyScreen")}
        />
      </View>
    </View>
  );
};

export default Accordition;
