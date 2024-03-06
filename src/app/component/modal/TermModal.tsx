import { View, Modal } from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HTMLView from "react-native-htmlview";
import Header from "../common/Header";
import NavButton from "../common/Buttons/NavButton";
import { serviceGetTerms } from "../../service/settings";
import { CrashlyticService } from "../../service/crashlytic";
import { trimHtml } from "../../utils/common";
import CustomActivityIndicator from "../common/CustomActivityIndicator";
interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  navigation?: any;
}
export default function TermModal({
  navigation,
  modalVisible,
  setModalVisible,
}: Props) {
  const { t } = useTranslation();
  const [content, setContent] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const getContent = () => {
    setIsLoading(true);
    serviceGetTerms()
      .then((res) => {
        setContent(trimHtml(res.data.terms));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("err", err);
        CrashlyticService({
          errorType: "Get Terms Error",
        });
      });
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={modalVisible}
    >
      <View className=" flex-1 bg-white" testID="terms_modal">
        <Header
          title={t("register_screen.terms_link") || "Privacy policy..."}
          leftBtn={
            <NavButton
              text={t("button.back") as string}
              onPress={() => setModalVisible(false)}
              withBackIcon
              testID="terms_modal_back_btn"
            />
          }
          containerStyle="mb-4"
        />
        <CustomActivityIndicator isVisible={isLoading} />
        {!isLoading ? (
          <HTMLView
            value={content}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              width: "100%",
              height: "100%",
              overflow: "scroll",
            }}
          />
        ) : null}
      </View>
    </Modal>
  );
}
