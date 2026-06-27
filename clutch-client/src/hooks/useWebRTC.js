import { useState, useEffect, useRef } from 'react';
import socket from '../socket/socket';
import { useNavigate } from 'react-router-dom';

export const useWebRTC = (roomId) => {
  const navigate = useNavigate();


  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [incomingCall, setIncomingCall] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const iceCandidateQueue = useRef([]); 

  const rtcConfig = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  useEffect(() => {
    let activeStream = null;
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = stream;
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMedia();

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

  // Add tracks automatically when localStream becomes available
  useEffect(() => {
    if (localStream && peerConnectionRef.current) {
      const senders = peerConnectionRef.current.getSenders();
      
      localStream.getTracks().forEach((track) => {
        const trackAlreadyAdded = senders.some((sender) => sender.track && sender.track.kind === track.kind);
        if (!trackAlreadyAdded) {
          peerConnectionRef.current.addTrack(track, localStream);
        }
      });
    }
  }, [localStream]);

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    const pc = new RTCPeerConnection(rtcConfig);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    // Let the browser automatically manage when we need to send an offer!
    pc.onnegotiationneeded = async () => {
      try {
        if (pc.signalingState !== "stable") return;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc-offer", { roomId, offer });
      } catch (err) {
        console.error("Negotiation error:", err);
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    
    // Creating the connection will add local tracks. 
    // This triggers onnegotiationneeded, which will automatically send the Offer!
    createPeerConnection();
    
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    socket.emit("reject-call", { targetSocketId: incomingCall });
    setIncomingCall(null);
  };

  useEffect(() => {
    socket.on("user-joined", (userID) => {
      setIncomingCall(userID);
    });

    socket.on("webrtc-offer", async ({ offer }) => {
      let pc = peerConnectionRef.current;
      if (!pc) {
        pc = createPeerConnection();
      }
      
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      iceCandidateQueue.current.forEach((candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      });
      iceCandidateQueue.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket.emit("webrtc-answer", {
        roomId,
        answer,
      });
    });

    socket.on("webrtc-answer", async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        
        iceCandidateQueue.current.forEach((candidate) => {
          peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
        });
        iceCandidateQueue.current = [];
      }
    });

    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        iceCandidateQueue.current.push(candidate);
      }
    });

    socket.on("call-rejected", () => {
      alert("Call was rejected");
      setIncomingCall(null);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      navigate("/");
    });

    return () => {
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
