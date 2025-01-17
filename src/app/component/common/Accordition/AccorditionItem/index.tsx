import React from "react";
import ArrowRight from "./assets/arrowRight.svg";
import { TouchableOpacity, View, Text } from "react-native";
import clsx from "clsx";

interface IAccorditionItemProps {
  title: string;
  onPress?: () => void;
}

const AccorditionItem: React.FC<IAccorditionItemProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx(
        "flex flex-row items-center border-b-[1px] border-b-gray-medium py-4"
      )}
      onPress={onPress}
    >
      <View className={clsx("flex-1")}>
        <Text className={clsx("text-h6 font-medium leading-6")}>{title}</Text>
      </View>
      <ArrowRight />
    </TouchableOpacity>
  );
};

export default AccorditionItem;
