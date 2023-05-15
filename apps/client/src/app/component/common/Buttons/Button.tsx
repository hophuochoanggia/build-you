import { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import clsx from 'clsx';

interface IButtonProps {
  title: string;
  containerClassName?: string;
  textClassName?: string;
  onPress?: () => void;
  Icon?: React.ReactNode;
}

const Button: FC<IButtonProps> = ({
  title,
  containerClassName,
  textClassName,
  onPress,
  Icon,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx(
        'mr-1 h-[48px] flex-1 rounded-[24px] ',
        containerClassName
      )}
      onPress={onPress}
    >
      <View className="flex flex-row items-center justify-center">
        {Icon && Icon}
        <Text
          className={clsx(
            'line-[30px] text-center text-sm font-medium',
            textClassName
          )}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const OutlineButton: FC<IButtonProps> = ({ title, onPress }) => {
  return (
    <Button
      title={title}
      containerClassName="bg-white border-primary-default border-[1px]"
      textClassName="text-primary-default"
      onPress={onPress}
    />
  );
};

export const FillButton: FC<IButtonProps> = ({ title, onPress }) => {
  return (
    <Button
      title={title}
      containerClassName="bg-primary-default border-primary-default border-[1px]"
      textClassName="text-basic-white"
      onPress={onPress}
    />
  );
};
export default Button;
