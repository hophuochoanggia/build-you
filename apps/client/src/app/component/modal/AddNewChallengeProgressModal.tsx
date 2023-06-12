import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
  ScaledSize,
  Platform,
} from 'react-native';
import React, { FC, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import CloseIcon from '../asset/close.svg';
import Header from '../common/Header';
import Button from '../common/Buttons/Button';
import ImagePicker from '../common/ImagePicker';
import VideoPicker from '../common/VideoPicker';
import LocationInput from '../common/Inputs/LocationInput';
import CustomTextInput from '../common/Inputs/CustomTextInput';

import { IUploadMediaWithId } from '../../types/media';

import Close from '../../component/asset/close.svg';
import { getRandomId } from '../../utils/common';

interface IAddNewChallengeProgressModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface IRenderSelectedMediaProps {
  screen: ScaledSize;
  selectedMedia: IUploadMediaWithId[];
  setSelectedMedia: (prev: IUploadMediaWithId[]) => void;
}

const RenderSelectedMedia: FC<IRenderSelectedMediaProps> = ({
  screen,
  selectedMedia,
  setSelectedMedia,
}) => {
  const handleRemoveItem = (id: string) => {
    const filteredMedia = selectedMedia.filter((media) => media.id !== id);
    setSelectedMedia(filteredMedia);
  };

  // px-5 + gap-2 + gap-2 = 56
  const singleImageWidth = (screen.width - 56) / 3;

  return (
    <View className="flex flex-row flex-wrap justify-start gap-2 pt-5">
      {selectedMedia?.length > 0 &&
        selectedMedia.map((media: any) => (
          <View
            className="relative aspect-square"
            style={{ width: singleImageWidth }}
            key={media.id}
          >
            <View className="absolute right-1 top-2 z-10">
              <Button
                onPress={() => handleRemoveItem(media.id)}
                Icon={<Close fill={'white'} />}
              />
            </View>
            <Image
              source={{ uri: media.uri as any }}
              className="h-full w-full rounded-xl"
            />
          </View>
        ))}
    </View>
  );
  ``;
};

export const AddNewChallengeProgressModal: FC<
  IAddNewChallengeProgressModalProps
> = ({ isVisible, onClose }) => {
  const [selectedMedia, setSelectedMedia] = useState<IUploadMediaWithId[]>([]);
  const [isSelectedImage, setIsSelectedImage] = useState<boolean | null>(null);

  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      goalName: '',
      uploadMedia: '',
      location: '',
    },
  });

  useEffect(() => {
    if (selectedMedia.length === 0) {
      setIsSelectedImage(null);
    }
  }, [selectedMedia]);

  const onSubmit = (data: any) => console.log(data);
  // TODO: handle change CREATE text color when input is entered

  const screen = Dimensions.get('window');

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={isVisible}
      className="h-full"
    >
      <SafeAreaView className="bg-white">
        <View className=" mx-4  h-full  rounded-t-xl bg-white">
          <View>
            <Header
              title={t('challenge_detail_screen.new_progress') as string}
              rightBtn={
                t('challenge_detail_screen.new_progress_post') as string
              }
              leftBtn={<CloseIcon width={24} height={24} fill={'#34363F'} />}
              onLeftBtnPress={onClose}
              containerStyle={Platform.OS === 'ios' ? 'mt-5' : 'mt-0'}
            />
          </View>
          <View className="flex flex-col justify-between px-5 pt-4">
            <CustomTextInput
              title="Caption"
              placeholderClassName="h-32"
              placeholder="What do you achieve?"
              control={control}
            />

            {selectedMedia && (
              <RenderSelectedMedia
                screen={screen}
                selectedMedia={selectedMedia}
                setSelectedMedia={setSelectedMedia}
              />
            )}

            <View className="">
              <ImagePicker
                onImagesSelected={(images) => {
                  images.forEach((uri: string) => {
                    const id = getRandomId();
                    setSelectedMedia((prev: IUploadMediaWithId[]) => [
                      ...prev,
                      { id, uri: uri },
                    ]);
                  });
                }}
                allowsMultipleSelection
                isSelectedImage={isSelectedImage}
                setIsSelectedImage={setIsSelectedImage}
              />
            </View>

            <View className="">
              <VideoPicker
                setExternalVideo={setSelectedMedia}
                isSelectedImage={isSelectedImage}
                setIsSelectedImage={setIsSelectedImage}
              />
            </View>

            <View className="pt-4">
              <LocationInput control={control} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default AddNewChallengeProgressModal;
