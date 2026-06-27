import { useState, useEffect, useRef } from 'react';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';

export const useWebRTC = (roomId) => {
  const navigate = useNavigate();

  //..
  //..
  // 1. INITIAL SETUP: State & References
  //..
  //..
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);

  //..
  //..
  // Why I use useRef for video elements:
  // Since a webcam stream is a complex live object (MediaStream) and not a simple string URL,
  // I can't just pass it into a React <video src="..."> prop. 
  // I must use useRef to grab the physical HTML <video> box on the screen, 
  // so I can manually inject the live stream into it later using vanilla JS: videoRef.current.srcObject = stream;
  //..
  //..
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  //..
  //..
  // We use useRef for the RTCPeerConnection instead of useState.
  // 1. Mutable Object: RTCPeerConnection is a complex object that manages its own internal state.
  // 2. No Re-renders: We don't want React to re-render the entire UI every time connection state changes.
  // 3. Persistence: useRef keeps the exact same connection object alive across component re-renders.
  //..
  //..
  const peerConnectionRef = useRef(null);
  const localStreamPromiseRef = useRef(null);

  //..
  //..
  // STUN Server Config: Yeh Google ka free server hai jo humein apna Public IP dhoondhne me madad karega (ICE Candidates banayega)
  //..
  //..
  const rtcConfigiceServers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  //..
  //..
  // 2. GETTING LOCAL MEDIA (Camera & Mic)
  // Yeh useEffect component load hote hi sirf ek baar chalta hai. (Empty dependency array [])
  //..
  //..
  useEffect(() => {
       //..
        //..
        // Browser se camera aur microphone ki permission mangta hai. 
        // Agar user 'Allow' karta hai, toh return mein live 'stream' milta hai.
        //..
        //..
          //..
        //..
        // Is stream ko state mein save kar rahe hain taaki baad mein muting/unmuting mein use kar sakein
        //..
        //..
    let activeStream = null;
    localStreamPromiseRef.current = navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        activeStream = stream;
        setLocalStream(stream);
        
        //..
        //..
        // Jo humne ref banaya tha, uske through actual HTML <video> box mein apna live camera feed dikha rahe hain
        //..
        //..
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        return stream;
      })
      .catch(err => {
        console.log("Error getting media: ", err);
        return null;
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  //..
  //..
  // 3. THE CORE CONNECTION ENGINE
    // Yeh function naya peer-to-peer connection banata hai do browsers ke beech
  //..
  //..  //..
    //..
    // STUN server configuration use karke naya RTCPeerConnection object banaya
    // Yeh humara main engine hai jo dusre person se directly connect karega
    //..
    //..
  const createPeerConnection = async () => {
    const pc = new RTCPeerConnection(rtcConfigiceServers);
 //..
    // Apna local camera/mic ka data (video & audio tracks) is connection mein feed kar rahe hain
    // Taki humara video network pe dusre person tak pahunch sake
    //..
    const stream = await localStreamPromiseRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    }

    //..
    //..
    // Jab dusra person apna video/audio bhejega, toh yeh 'ontrack' event trigger hoga
    // Hum uske video stream ko state mein save karke apne screen (remoteVideoRef) par dikha rahe hain
    //..
    //..
    pc.ontrack = (event) => {
      // console.log("Got remote track!", event.streams[0]);
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    //..
    //..
    // ICE Candidates: Yeh hamare public IP/Port address hote hain
    // Browser background mein apna Public IP dhoondhta hai. Jaise hi milta hai, hum socket se usko dusre person ko bhej dete hain
    // Taki dono browsers ek dusre ka address jaan sakein aur connect ho sakein
    //..
    //..
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    //..
    //..
    // Is pure connection object ko ref mein save kar liya taaki aage calls accept/reject mein use ho sake
    //..
    //..
    peerConnectionRef.current = pc;
    return pc;
  };

  //..
  //..
  // 4. USER ACTIONS (Accepting/Rejecting Calls)
  //..
  //..
  const acceptCall = async () => {
    if (!incomingCall) return;
    
    const pc = await createPeerConnection();
    
    //..
    //..
    // 'Offer' banaya ki hum call karne ke liye ready hain aur humari details yeh hain
    //..
    //..
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    //..
    //..
    // Socket se samne wale ko apna Offer bhej diya
    //..
    //..
    socket.emit("webrtc-offer", {
      targetSocketId: incomingCall,
      offer,
      roomId,
    });
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socket.emit("reject-call", { targetSocketId: incomingCall });
    setIncomingCall(null);
  };

  //..
  //..
  // 5. THE SIGNALING SWITCHBOARD (Socket.io)
  // Yeh useEffect backend se aane wale saare signals sunta hai
  //..
  //..
  useEffect(() => {
    //..
    //..
    // Signal 1: Koi naya banda room me aaya. Uska alert dikhate hain.
    //..
    //..
    socket.on("user-joined", (userID) => {
      // console.log("remote user joined: ", userID);
      setIncomingCall(userID);
    });

    //..
    //..
    // Signal 2: Kisi aur ne mujhe Offer (call request) bheja hai.
    //..
    //..
    socket.on("webrtc-offer", async ({ offer }) => {
      // console.log("Received an offer, creating answer");
      const pc = await createPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Ab main apna 'Answer' banaunga
      const answer = await pc.createAnswer();
      
      // Apne answer ko apna "Local Description" set kar raha hu
      await pc.setLocalDescription(answer);
      
      // Answer wapas socket ke through usko bhej raha hu
      socket.emit("webrtc-answer", { roomId, answer });
    });

    //..
    //..
    // Signal 3: Kisi ne mere Offer ka Answer de diya hai (Call utha li).
    //..
    //..
    socket.on("webrtc-answer", async ({ answer }) => {
      // console.log("answer recived: ", answer);
      
      // Agar mera connection abhi zinda hai, toh unka answer "Remote Description" me set kar dunga
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    //..
    //..
    // Signal 4: P2P connection ke liye raaste (Public IPs/ICE candidates) aana shuru ho gaye!
    //..
    //..
    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current) {
        try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error("Error adding ICE candidate:", e);
        }
      }
    });

    //..
    //..
    // Signal 5: Call kaat di
    //..
    //..
    socket.on("call-rejected", () => {
      alert("Call was rejected");
      navigate("/");
    });

    return () => {
      // Cleanup function: Jab main room leave karu, toh saare listener hata dunga warna memory leak hoga.
      socket.off("user-joined");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
      socket.off("call-rejected");

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [roomId, navigate]);

  //..
  //..
  // 6. RETURNING THE CONTROLS
  // Yeh saari details aur functions hum StudyRoom.jsx ko wapas de rahe hain.
  // Taki StudyRoom inka use karke apne UI buttons (mute/unmute, accept/reject) ko active kar sake aur video boxes screen par dikha sake.
  //..
  //..
  return {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    incomingCall,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    acceptCall,
    rejectCall
  };
};
