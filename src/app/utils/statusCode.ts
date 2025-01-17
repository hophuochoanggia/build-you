import i18n from "../i18n/i18n";

export const errorMessage = (error: any, type: string) => {
  const OBJ_STATUS_CODE = i18n.t(`errorMessage:${type}`, {
    returnObjects: true,
  }) as Array<any>;
  console.log("OBJ_STATUS_CODE", OBJ_STATUS_CODE);
  const responseBody = error.response?.data;
  for (const key in OBJ_STATUS_CODE) {
    if (responseBody?.statusCode == key) {
      return i18n.t(`errorMessage:${type}.${key}`);
    } else {
      return i18n.t("errorMessage:500");
    }
  }
};

export const err_server = i18n.t("errorMessage:500");
