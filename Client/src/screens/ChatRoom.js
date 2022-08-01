import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShare from '@mui/icons-material/CancelPresentation';
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./screen.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Peer from "simple-peer";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CopyToClipboard from "react-copy-to-clipboard";
import Loader from "../components/Loader";

const ChatRoom = ({ chatRoom, me, socket }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [idToCall, setIdToCall] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState(false);
  const [modal, setModal] = useState(false);
  const [mute, setMute] = useState(false);
  const [stopVideo, setStopVideo] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    getUserMediaStream()
    socket.on("calluser", ({ from, name, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setName(name);
      setCallerSignal(signal);
    });
  }, [socket]);
  
      
  const callUser = (id) => {
    setLoading(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callaccepted", ({ signal }) => {
      setCallAccepted(true);
      setModal(false);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setModal(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  const displayMediaStream= () => {
    navigator.mediaDevices.getDisplayMedia({cursor:true})
      .then((currentStream) => {
        myVideo.current.srcObject = currentStream;
        setStream(currentStream);
      })
  }

  const getUserMediaStream = () => {
    navigator.mediaDevices
      .getUserMedia({audio:true, video:true})
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
  }


  const handleClick = () => {
    setModal(false);
    setIdToCall("");
    setName("");
  };

  const chatToggle = () => {
    const data = chat ? false : true;
    setChat(data);
  }

  const muteUnmute = () => {
    const enabled = stream.getAudioTracks()[0].enabled;
    if (enabled) {
      stream.getAudioTracks()[0].enabled = false;
      setMute(true);
    } else {
      stream.getAudioTracks()[0].enabled = true;
      setMute(false);
    }
  };

  const playStopVideo = () => {
    const enabled = stream.getVideoTracks()[0].enabled;
    if (enabled) {
      stream.getVideoTracks()[0].enabled = false;
      setStopVideo(true);
    } else {
      stream.getVideoTracks()[0].enabled = true;
      setStopVideo(false);
    }
  };

  const shareScreenToggle = () => {
    shareScreen ? (
      stream.getVideoTracks().forEach((track) => {
        if (track.kind === 'video') {
            track.stop();
        }
      })
    ):
    displayMediaStream()
    const data = shareScreen ? false : true;
    setShareScreen(data);
  }
  // const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  return (
    <>
    <div className="container">
      <div className="main_container">
        <div className="video_container">
          {stream && (
            <>
              <video controls playsInline ref={myVideo} muted autoPlay/>
            </>
          )}
          {callAccepted && !callEnded && (
            <>
              <video controls playsInline ref={userVideo} autoPlay/>
            </>
          )}
        </div>
        {chatRoom === "host" ? (
          <Modal isOpen={modal} className="answer_call_container">
            <div className="modal">
              <ModalHeader className="header">
                <span>Participants</span>
                <div className="close" onClick={() => setModal(false)}><CloseIcon /></div>
              </ModalHeader>
              <ModalBody className="participants">
                {receivingCall && !callAccepted && (
                  <div className="user">
                    <span>{name}</span>
                    <div onClick={answerCall} className="accept_button">Accept</div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter className="footer_modal">
                <span>Room ID: {me}</span>
                <CopyToClipboard text={me}>
                  <div className="content_copy"><ContentCopyIcon /></div>
                </CopyToClipboard>
              </ModalFooter>
            </div>
          </Modal>
        ) : (
          <Modal className="join_modal" isOpen={modal}>
            <div className="form_container">
              { loading && !callAccepted ? (
                <Loader />
              ) : (
                <>
                <ModalHeader>
                  <h2>Join Room</h2>
                </ModalHeader>
                  <ModalBody className="form">
                    <input className="input_modal"
                      placeholder="Room ID"
                      value={idToCall}
                      onChange={(e) => setIdToCall(e.target.value)}
                    />
                    <input className="input_modal"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </ModalBody>
                  <ModalFooter className="form_button">
                    <Button type="submit" onClick={handleClick} className="form_button">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!(idToCall && name) ? true : false}
                      primary
                      onClick={() => callUser(idToCall)}
                      className="form_button"
                    >
                      Join
                    </Button>
                  </ModalFooter>
                </>
              )}
            </div>
          </Modal>
        )}
        <div className="video_footer">
          <div className="control_left">
            <div className="control_button" onClick={muteUnmute}>
              {mute ? <MicOffIcon style={{ fill: "#d40303" }} /> : <MicIcon />}
              {mute ? (
                <span style={{ color: "#d40303" }}>Unmute</span>
              ) : (
                <span>Mute</span>
              )}
            </div>
            <div className="control_button" onClick={playStopVideo}>
              {stopVideo ? (
                <VideocamOffIcon style={{ fill: "#d40303" }} />
              ) : (
                <VideocamIcon />
              )}
              {stopVideo ? (
                <span style={{ color: "#d40303" }}>Play Video</span>
              ) : (
                <span>Stop Video</span>
              )}
            </div>
            <div className="control_button" onClick={shareScreenToggle}>
              {
                shareScreen ? <StopScreenShare></StopScreenShare> : <ScreenShareIcon>Share Screen</ScreenShareIcon>
              }
              {
                shareScreen ? <span style={{ color: "#d40303" }}> Stop Screen Share</span> : <span>Screen Share</span> 
              }
            </div>
          </div>
          <div className="controls_center">
            <div className="control_button" onClick={() => setModal(true)}>
              <SupervisorAccountIcon />
              <span>Participants</span>
            </div>
            <div className="control_button" onClick={chatToggle}>
              <ChatBubbleIcon />
              <span>Chat</span>
            </div>
          </div>
          <div className="controls_right"
            onClick={idToCall ? leaveCall : () => window.location.reload()}
          >
            <span>{idToCall ? "Leave Meeting" : "End Meeting"}</span>
          </div>
        </div>
      </div>
      { chat ?  <div chat={chat} className='chat_container'>
        <h5 className="chat_content">Chat</h5>
        <div className="chat"></div>
        <div className="input_container">
          <input type="text" placeholder="Type message here..." />
          {/* <button type="submit">Send</button> */}
        </div>
      </div> : null
      }
     
    </div>
    </>
  );
};

export default ChatRoom;