import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { MediaStream, RTCPeerConnection, RTCView } from "react-native-webrtc";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useEffect, useRef, useState } from "react";
import { getLocalStream } from "./Utils";
import { SafeAreaView } from "react-native";

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyAB3284qa9fUTgYtGP_e0nOCBzfwc9ZhAg",
    authDomain: "webrtc-intro-dce56.firebaseapp.com",
    projectId: "webrtc-intro-dce56",
    storageBucket: "webrtc-intro-dce56.appspot.com",
    messagingSenderId: "4376297672",
    appId: "1:4376297672:web:7263074fbe4a0fed68e5fd",
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const firestore = getDatabase(app);
  const [localStream, setLocalStream] = useState({
    video: null,
    buttonText: "start",
  });
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef();
  const connecting = useRef();

  const startLocalStream = async () => {
    const mediaStream = await getLocalStream();
    setLocalStream({
      video: mediaStream,
      buttonText: "stop",
    });
  };

  // useEffect(async () => {
  const toggleLocalStream = async () => {
    if (localStream.video) {
      // stop local stream
    } else {
      console.log("i am here");
      await startLocalStream();
    }
  };

  const initRTCPeerConnection = async () => {
    /** configuration object for the RTCPeerConnection */
    const servers = {
      iceServers: [
        {
          urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
      ],
      iceCandidatePoolSize: 10,
    };
    try {
      /**
       * An instance of the `RTCPeerConnection` class. Represents a connection between the local device and
       * a remote peer for the purpose of real-time communication, such as audio or video conferencing.
       */
      peerConnection.current = new RTCPeerConnection(servers);
      console.log("RTCPeerConnection initialized:", peerConnection.current);

      // get video for the call

      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
      });
      /** remote stream for a while */
      // const rs = new MediaStream();
      // peerConnection.current.ontrack = (event) => {
      //   event.streams[0].getTracks().forEach((track) => {
      //     rs.addTrack(track);
      //   });
      // };
      // setRemoteStream(rs);
    } catch (error) {
      console.error("Error initializing RTCPeerConnection:", error);
    }
  };
  // initRTCPeerConnection();
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Button title={localStream.buttonText} onPress={toggleLocalStream} />
      <View style={styles.rtcview}>
        {localStream.video && <RTCView style={styles.localstream} streamURL={localStream.video.toURL()} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },
  rtcview: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "yellow",
  },
  localstream: {
    width: "100%",
    height: "100%",
  },
});
