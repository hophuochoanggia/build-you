import React, { FC } from "react";
import { View, Text } from "react-native";

import Dot from "./assets/dot.svg";
import CurrentDot from "./assets/current-dot.svg";
import { useTranslation } from "react-i18next";

interface IStepOfStepsProps {
  step: number;
  totalSteps: number;
}

const StepOfSteps: FC<IStepOfStepsProps> = ({ step, totalSteps }) => {
  const { t } = useTranslation();

  const renderRemainingDots = () => {
    const remainingDots = totalSteps - step;
    const dots = [];
    for (let i = 0; i < remainingDots; i++) {
      dots.push(<Dot fill="#D6D9E2" key={i} />);
    }
    return <View className="flex flex-row space-x-2">{dots}</View>;
  };

  const renderCurrentDot = () => {
    return <CurrentDot fill="#256FFF" />;
  };

  const renderDoneDots = () => {
    const doneDots = step - 1;
    const dots = [];
    for (let i = 0; i < doneDots; i++) {
      dots.push(<Dot fill="#20D231" key={totalSteps - i} />);
    }
    if (doneDots === 0) {
      return null;
    }
    return <View className="flex flex-row space-x-2">{dots}</View>;
  };

  return (
    <View className="mt-8 flex h-8 flex-col items-center justify-between">
      <Text className="font-regular text-md font-normal leading-4 text-black-default">
        {t("step_of", {
          currentStep: step,
          totalStep: totalSteps,
        })}
      </Text>
      <View className="flex flex-row items-center justify-center space-x-2">
        {renderDoneDots()}
        {renderCurrentDot()}
        {renderRemainingDots()}
      </View>
    </View>
  );
};

export default StepOfSteps;
