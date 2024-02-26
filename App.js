import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MediaStream, RTCPeerConnection } from "react-native-webrtc";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useEffect, useRef, useState } from "react";
import { getStream } from "./Utils";
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
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef();
  const connecting = useRef();
  // useEffect(async () => {
  const initRTCPeerConnection = async () => {
    /**
     * configuration object for the RTCPeerConnection
     */
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
      console.log("RTCPeerConnection initialized:", peerConnection);
      peerConnection.current = new RTCPeerConnection(servers);
      // get video for the call
      const mediaStream = await getStream();
      if (mediaStream) {
        setLocalStream(mediaStream);
        mediaStream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, mediaStream);
        });
      }
      peerConnection.current.ontrack = (event) => {};
    } catch (error) {
      console.error("Error initializing RTCPeerConnection:", error);
    }
  };
  // initRTCPeerConnection();
  // }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
