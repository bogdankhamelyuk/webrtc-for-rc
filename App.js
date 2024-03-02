import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Switch, SafeAreaView } from "react-native";
import { MediaStream, RTCPeerConnection, RTCView } from "react-native-webrtc";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useEffect, useRef, useState } from "react";
import { getLocalStream } from "./Utils";

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

  const startLocalStream = async () => {
    const mediaStream = await getLocalStream();
    setLocalStream(mediaStream);
  };
  const startRemoteStream = () => {
    const remoteStreamObj = new MediaStream();
    peerConnection.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamObj.addTrack(track);
      });
    };
    setRemoteStream(remoteStreamObj);
  };
  const stopLocalStream = () => {
    localStream.video.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
  };

  const isLocalStreamAvailable = () => {
    return localStream.video ? true : false;
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
       * create an instance of the `RTCPeerConnection` class. Represents a connection between the local device and
       * a remote peer for the purpose of real-time communication, such as audio or video conferencing.
       */
      peerConnection.current = new RTCPeerConnection(servers);
      console.log("RTCPeerConnection initialized:", peerConnection.current);
      startLocalStream();
      // Push tracks from local stream to peer connection
      localStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream);
      });
      startRemoteStream();
    } catch (error) {
      console.error("Error initializing RTCPeerConnection:", error);
    }
  };
  // initRTCPeerConnection();
  // }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* <Button title={localStream.buttonText} onPress={toggleLocalStream} /> */}
      <View style={styles.rtcview}>
        {localStream && <RTCView style={styles.localstream} streamURL={localStream.toURL()} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "center",
    // alignItems: "center",
    // height: "100%",
    // display: "flex",
  },
  rtcview: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "black",
  },
  localstream: {
    width: "100%",
    height: "100%",
  },
});
