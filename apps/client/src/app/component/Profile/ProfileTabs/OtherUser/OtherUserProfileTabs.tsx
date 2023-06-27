import React, { FC, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import TabViewFlatlist from '../../../common/Tab/TabViewFlatlist';


import Skills from '../Users/Skills';
import ChallengesTab from './Challenges/ChallengesTab';
import { IUserData } from '../../../../types/user';
import Biography from '../Users/Biography';
import EmployeesTab from '../Company/Employees/Employees';
import { fetchListEmployee } from 'apps/client/src/app/utils/profile';
import { useUserProfileStore } from 'apps/client/src/app/store/user-data';

interface IOtherUserProfileTabsProps {
  otherUserData: IUserData | null;
}

const OtherUserProfileTabs: FC<IOtherUserProfileTabsProps> = ({
  otherUserData,
}) => {
  const { t } = useTranslation();
  const [employeeList, setEmployeeList] = useState([])

  useEffect(() => {
    if (!otherUserData?.id || !otherUserData?.companyAccount) return
    fetchListEmployee(otherUserData?.id, (res: any) => {
      return setEmployeeList(res)
    })

  }, [otherUserData?.companyAccount, otherUserData?.id])
  const titles = [
    t('profile_screen_tabs.biography'),
    !otherUserData?.companyAccount ? t('profile_screen_tabs.skills') : t('profile_screen_tabs.employees'),
    t('profile_screen_tabs.challenges'),
  ];

  return (
    <ScrollView className={clsx('flex-1 bg-gray-50 h-full')}>
      {otherUserData !== null && (
        <TabViewFlatlist

          titles={titles}
          children={[
            <Biography userProfile={otherUserData} key="0" />,
            !otherUserData?.companyAccount ? <Skills skills={otherUserData?.softSkill} key="1" /> : <EmployeesTab key="1" employeeList={employeeList} />,
            <ChallengesTab userId={otherUserData.id} key="2" />,
          ]}
          activeTabClassName=""
          defaultTabClassName="text-gray-dark"
        />
      )}
      {otherUserData === null && (
        <View className={clsx('flex-1  bg-gray-50')}>
          <Text className={clsx('text-gray-dark')}>Loading...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default OtherUserProfileTabs;