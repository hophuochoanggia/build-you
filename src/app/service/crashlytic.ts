import crashlytics from "@react-native-firebase/crashlytics";

import {
  getReadableVersion,
  getSystemVersion,
  getBrand,
  getModel,
} from "./deviceInfo";

interface ICrashlyticServiceArgs {
  errorType: string;
  error?: Error;
}

export const CrashlyticService = async ({
  errorType,
  error,
}: ICrashlyticServiceArgs) => {
  if (__DEV__) {
    return;
  }

  await Promise.all([
    crashlytics().log(errorType),
    error && crashlytics().recordError(error),
  ]);
};

export const InitCrashlytics = async (userId: string) => {
  if (__DEV__) {
    return;
  }
  const appVersionAndBuildNumber = getReadableVersion();
  const systemVersion = getSystemVersion();
  const brand = getBrand();
  const model = getModel();

  await crashlytics().setUserId(userId);
  await crashlytics().setAttributes({
    appVersionAndBuildNumber,
    brand,
    model,
    systemVersion,
  });
};

export const ClearCrashlytics = async () => {
  if (__DEV__) {
    return;
  }
  await crashlytics().setUserId("");
  await crashlytics().setAttributes({});
};
