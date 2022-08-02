import React, {useState} from "react";
import { Button } from "reactstrap";
import ChatRoom from "../../screens/ChatRoom";
import { io } from "socket.io-client";

 function JoinRoom (){
    const [roomId, setRoomId] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [isRoomJoined,setIsRoomJoined] = useState(false);
    const [chatRoom, setChatRoom] = useState("");
    const [me, setMe] = useState("");

    const socket = io("http://localhost:5000");
    const handleInputId = (e) => {
        setRoomId(e.target.value);
    }

    const handleInputPassword = (e) => {
        setRoomPassword(e.target.value);
    }

    const handleJoin = () => {
        let data = {roomId, roomPassword};
        const url = "http://localhost:5000/joinroom";
        fetch(url,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
          }
        }).then((res)=>{
            setIsRoomJoined(true);
        })

        isRoomJoined ? setChatRoom("guest") : setChatRoom('');
    }

    return(
        chatRoom !== "" ? (
            <ChatRoom chatRoom={chatRoom} me={me} socket={socket} />
          ) : (
                <div>
                    <input type="text" placeholder="enter RoomId" value={roomId} onChange={handleInputId} className="input_join_room" />
                    <input type="password" placeholder="enter RoomPassword" value={roomPassword} onChange={handleInputPassword} className="input_join_room"/> 
                    <Button onClick={handleJoin}> Join Room</Button>
                </div>
            )
    )
 }
export default JoinRoom;