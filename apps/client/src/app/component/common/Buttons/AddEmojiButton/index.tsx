import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';

import Button from '../Button';
import AddEmojiIcon from '../asset/add-emoji.svg';

interface IAddEmojiButtonProps {
  selectedEmoji: string | null;
  triggerFunction: () => void;
}

const renderEmojiButton = (
  triggerFunction: () => void,
  selectedEmoji: string | null
) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={clsx(
        'border-gray-medium bg-gray-veryLight mr-1 w-12 flex-1 rounded-lg border'
      )}
      onPress={triggerFunction}
    >
      {!selectedEmoji && (
        <View className="flex-1 flex-row items-center justify-center">
          <AddEmojiIcon />
        </View>
      )}
      {selectedEmoji && (
        <View className="border-gray-medium h-12 w-12 rounded-lg border">
          <Text className="pt-1 text-center text-3xl">{selectedEmoji}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const AddEmojiButton: React.FC<IAddEmojiButtonProps> = ({
  selectedEmoji,
  triggerFunction,
}) => {
  return (
    <View className={clsx(' flex h-12 w-full flex-row items-center')}>
      <Text className={clsx('text-primary-default text-md font-semibold')}>
        Emoji
      </Text>
      <View className="flex flex-1 items-start pl-4">
        {renderEmojiButton(triggerFunction, selectedEmoji)}
      </View>
    </View>
  );
};

export default AddEmojiButton;
