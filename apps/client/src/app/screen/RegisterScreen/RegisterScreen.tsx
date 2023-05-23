import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '../../component/common/Inputs/TextInput';
import { CheckBox, Icon } from '@rneui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterValidationSchema } from '../../Validators/Register.validate';
import Button from '../../component/common/Buttons/Button';
import { useNavigation } from '@react-navigation/native';
import PolicyModal from '../../component/modal/PolicyModal';
import RegisterCreating from '../../component/modal/RegisterCreating';
import IconEyeOn from './asset/icon-eye.svg';
import IconEyeOff from './asset/eye-off.svg';
import ErrorText from '../../component/common/ErrorText';
type FormData = {
  email: string;
  password: string;
  repeat_password: string;
  check_policy: boolean;
};
export default function RegisterScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const [ruleBtnChecked, setRuleBtnChecked] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      repeat_password: '',
      check_policy: false,
    },
    resolver: yupResolver(RegisterValidationSchema()),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRegisterCreating, setModalRegisterCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <SafeAreaView>
      <View className="flex-column h-full justify-between bg-white px-6  pb-14">
        <View>
          <View className="flex-column items-center ">
            <Image
              className=" mb-7 mt-10 h-[91px] w-[185px]"
              source={require('./asset/buildYou.png')}
              resizeMode="cover"
            />
            <Text className="text-h6 text-gray-dark px-24 text-center leading-6 ">
              {t('register_screen.sub_title')}
            </Text>
          </View>
          <View className="mt-4 flex flex-col ">
            {(
              t('form', {
                returnObjects: true,
              }) as Array<any>
            ).map((item, index) => {
              if (item.name === 'code') {
                return;
              } else {
                return (
                  <View className="pt-5" key={index}>
                    <Controller
                      control={control}
                      name={item.name}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <View className="flex flex-col gap-1">
                          <TextInput
                            rightIcon={
                              (item.name === 'repeat_password' ||
                                item.name === 'password') &&
                              (!showPassword ? (
                                <TouchableOpacity
                                  onPress={() => setShowPassword(!showPassword)}
                                  className=" mt-[2px]"
                                >
                                  <IconEyeOn />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => setShowPassword(!showPassword)}
                                  className=" mt-[2px]"
                                >
                                  <IconEyeOff />
                                </TouchableOpacity>
                              ))
                            }
                            label={item.label}
                            placeholder={item.placeholder}
                            placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                            onBlur={onBlur}
                            onChangeText={(text) => onChange(text)}
                            value={value}
                            className="  border-gray-medium bg-gray-veryLight  w-full rounded-[10px] border-[1px] p-4  "
                          />
                        </View>
                      )}
                    />
                    {errors[item.name as keyof FormData] && (
                      <ErrorText
                        message={errors[item.name as keyof FormData]?.message}
                      />
                    )}
                  </View>
                );
              }
            })}

            <Controller
              control={control}
              name="check_policy"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="">
                  <CheckBox
                    title={
                      <View className="gray-black-light ml-3 flex-row flex-wrap  text-sm leading-6 ">
                        <Text className="">{t('register_screen.policy')}</Text>
                        <Text
                          className="cursor-pointer font-medium  underline underline-offset-1"
                          onPress={() => setModalVisible(true)}
                        >
                          {t('register_screen.policy_link')}
                        </Text>
                        <Text className=""> {t('and')} </Text>
                        <Text
                          className="cursor-pointer font-medium underline underline-offset-auto"
                          onPress={() => setModalVisible(true)}
                        >
                          {t('register_screen.terms_link')}
                        </Text>
                        <Text className=""> {t('and')} </Text>
                        <Text
                          className="cursor-pointer  font-medium underline underline-offset-1"
                          onPress={() => setModalVisible(true)}
                        >
                          {t('register_screen.conditions_link')}
                        </Text>
                      </View>
                    }
                    containerStyle={{
                      backgroundColor: 'transparent',
                      paddingBottom: 0,
                      paddingLeft: 0,
                      marginTop: 10,
                    }}
                    checked={ruleBtnChecked}
                    onPress={() => {
                      setRuleBtnChecked(!ruleBtnChecked);
                      setValue('check_policy', !ruleBtnChecked);
                    }}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="blue"
                  />
                  {errors.check_policy && (
                    <ErrorText message={errors.check_policy?.message} />
                  )}
                </View>
              )}
            />
          </View>
        </View>
        <Button
          containerClassName="  bg-primary-default flex-none px-1 "
          textClassName="line-[30px] text-center text-md font-medium text-white"
          title={t('button.next')}
          onPress={handleSubmit(onSubmit)}
        />
        <PolicyModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <RegisterCreating
          navigation={navigation}
          modalVisible={modalRegisterCreating}
          setModalVisible={setModalRegisterCreating}
        />
      </View>
    </SafeAreaView>
  );
}
