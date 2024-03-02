import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Switch, SafeAreaView } from "react-native";
import { MediaStream, RTCPeerConnection, RTCView } from "react-native-webrtc";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, collection } from "firebase/firestore";
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
  let app, firestoreDB, callDocId;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef();
  const connecting = useRef();

  const startFirebase = () => {
    app = initializeApp(firebaseConfig);
    firestoreDB = getFirestore(app);
  };

  const startCall = async () => {
    //ToDo: read docs: https://rnfirebase.io/firestore/usage
    startFirebase();
    const callDoc = collection(firestoreDB, "calls");
    const offerCandidates = doc(firestoreDB, "calls/offerCandidates");
    const answerCandidates = doc(firestoreDB, "calls/answerCandidates");
    callDocId = callDoc.id;
    await initRTCPeerConnection();
    peerConnection.current.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };
    console.log("OK");
  };

  const startLocalStream = async () => {
    const mediaStream = await getLocalStream();
    setLocalStream(mediaStream);
    return Promise.resolve(mediaStream);
  };

  /**Initialize a remote video feed with an empty stream.
   * Eventually, the stream will be populated when tracks are added to the peer connection. */
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
    const config = {
      iceServers: [
        {
          urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
      ],
      iceCandidatePoolSize: 10,
    };
    try {
      peerConnection.current = new RTCPeerConnection(config);
      const ls = await startLocalStream();
      // Push tracks from local stream to peer connection
      ls.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, ls);
      });
      startRemoteStream();
      return Promise.resolve();
    } catch (error) {
      // console.error("Error initializing RTCPeerConnection:", error);
      return Promise.reject(error);
    }
  };

  if (!remoteStream) {
    return (
      <SafeAreaView style={styles.container}>
        <Button title="Start call" onPress={startCall} />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.rtcview}>
          <RTCView style={styles.localstream} streamURL={localStream.toURL()} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    // height: "100%",
    display: "flex",
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
