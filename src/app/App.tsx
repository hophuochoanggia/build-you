import RootNavigation from "./navigation";
import { MenuProvider } from "react-native-popup-menu";
import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { StatusBar } from "react-native";
import { EventProvider } from "react-native-outside-press";

import "./i18n/i18n";
import Toast from "./component/common/Toast/Toast";

export const App = () => {
  const [fontLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  if (!fontLoaded) {
    return null;
  }
  StatusBar.setBarStyle("dark-content", true);

  return (
    <MenuProvider>
      <EventProvider>
        <Toast />
        <RootNavigation />
      </EventProvider>
    </MenuProvider>
  );
};

export default App;
