import { mediaDevices } from "react-native-webrtc";

export async function getLocalStream() {
  let mediaConstraints = {
    audio: true,
    video: true,
  };
  try {
    const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
    return mediaStream;
  } catch (err) {
    console.log(err);
  }
}
