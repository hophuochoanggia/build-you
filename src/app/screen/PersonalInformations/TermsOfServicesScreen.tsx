import { StyleProp, View, ViewStyle } from "react-native";
import { FC, useEffect, useState } from "react";
import HTMLView from "react-native-htmlview";
import { serviceGetTerms } from "../../service/settings";
import { CrashlyticService } from "../../service/crashlytic";
import CustomActivityIndicator from "../../component/common/CustomActivityIndicator";
import { trimHtml } from "../../utils/common";
import clsx from "clsx";

interface ITermsOfServicesScreenProps {
  containerClassName?: string;
  contentStyle?: StyleProp<ViewStyle>;
}

const TermsOfServicesScreen: FC<ITermsOfServicesScreenProps> = ({
  containerClassName,
  contentStyle,
}) => {
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
          error: err,
        });
      });
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <View
      className={clsx("flex-1 overflow-scroll bg-white", containerClassName)}
    >
      <CustomActivityIndicator isVisible={isLoading} />
      <View
        style={[
          {
            paddingVertical: 16,
            paddingHorizontal: 16,
            width: "100%",
            height: "100%",
          },
          contentStyle,
        ]}
      >
        {!isLoading ? <HTMLView value={content} /> : null}
      </View>
    </View>
  );
};

export default TermsOfServicesScreen;
