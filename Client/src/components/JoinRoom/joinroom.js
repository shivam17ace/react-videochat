import React, {useState} from "react";
import { Button } from "reactstrap";
 function JoinRoom (){
    const [roomId, setRoomId] = useState('');
    const [roomPassword, setRoomPassword] = useState('');

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
        })
    }

    return(
        <div>
             <input type="text" placeholder="enter RoomId" value={roomId} onChange={handleInputId} className="input_join_room" />
            <input type="password" placeholder="enter RoomPassword" value={roomPassword} onChange={handleInputPassword} className="input_join_room"/> 
            <Button onClick={handleJoin}> Join Room</Button>
        </div>
    )
 }
export default JoinRoom;