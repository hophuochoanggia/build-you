import { Platform } from "react-native";
import httpInstance from "./http";
import { CrashlyticService } from "../service/crashlytic";

export const uploadNewVideo = async (video: string | undefined) => {
  try {
    if (!video) return;
    const formData = new FormData();
    // detect file type
    const type = video.split(".").pop();
    const uri =
      Platform.OS === "android" ? video : video.replace("file://", "");
    const name = `video.${type}`;
    formData.append("file", {
      uri: uri,
      name,
      type: `video/${type}`,
    } as any);

    const response = await httpInstance.post("/user/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (e) {
    console.error("uploadNewVideo", e);
    CrashlyticService({
      errorType: "Upload Video Error",
      error: e,
    });
  }
};
