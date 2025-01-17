import { FC, useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import clsx from "clsx";
import Modal from "react-native-modal";

import Button from "../../Buttons/Button";
import BottomSheet2 from "../../BottomSheet/BottomSheet";
import { FlatList } from "react-native-gesture-handler";
import BottomSheetOption from "../../Buttons/BottomSheetOption";
import { useTranslation } from "react-i18next";

interface ISelectPickerProps {
  show: boolean;
  title?: string;
  data: Array<any> | null | undefined;
  selectedIndex?: number;
  onSelect: (index: number) => void;
  onCancel: () => void;
  onLoadMore?: () => void;
}
const SelectPicker: FC<ISelectPickerProps> = ({
  show,
  title,
  data,
  selectedIndex,
  onSelect,
  onCancel,
  onLoadMore,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    setSelected(selectedIndex || 0);
  }, [selectedIndex]);

  return (
    <Modal
      isVisible={show}
      onBackdropPress={onCancel}
      // onSwipeComplete={onCancel}
      // swipeDirection={'down'}
      hasBackdrop
      onBackButtonPress={onCancel}
      backdropColor={"#85868C"}
      backdropOpacity={0.3}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <TouchableOpacity
        style={{ height: "30%", backgroundColor: "transparent" }}
        activeOpacity={0}
        onPressOut={onCancel}
      ></TouchableOpacity>
      <View className=" flex-1">
        <BottomSheet2 onClose={onCancel} snapPoints={["100%"]}>
          <View className="relative">
            <View className="flex w-full flex-row items-center justify-center pb-8">
              <Text className="text-base font-semibold">{title}</Text>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item, index) => `${Math.random()}-${index}}`}
              renderItem={({ item, index }) => {
                return (
                  <View
                    className="px-4"
                    testID={
                      index == 0
                        ? "complete_profile_step_1_occupation_picker_item_0"
                        : null
                    }
                  >
                    <BottomSheetOption
                      onPress={() => setSelected(index)}
                      title={item?.name || item?.label}
                      containerClassName={clsx(
                        "focus:bg-gray-light",
                        index === selected && "bg-gray-light"
                      )}
                      textClassName={clsx(
                        "text-base font-normal",
                        index === selected && "font-semibold"
                      )}
                    />
                  </View>
                );
              }}
              onEndReached={onLoadMore}
              ListFooterComponent={<View className="h-10" />}
              onEndReachedThreshold={0.5}
              className="h-4/5"
            />
            <View className="absolute bottom-[-20px] h-12 w-full bg-white px-4">
              <Button
                title={t("save") || "Save"}
                onPress={() => onSelect(selected)}
                containerClassName="bg-primary-default flex-1"
                textClassName="text-white"
                testID="complete_profile_step_1_occupation_picker_save_btn"
              />
            </View>
          </View>
        </BottomSheet2>
      </View>
    </Modal>
  );
};

export default SelectPicker;
