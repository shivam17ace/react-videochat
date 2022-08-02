import React from "react";
import { Link } from "react-router-dom";

function MainScreen(){
  return(
    <div>
      <div>
        <h1>Video Chat</h1>
        <div>
          <button primary>
            <Link to ='/createroom'>Create a Room</Link>
          </button>
          <button><Link to ='/joinroom'>Join a Room</Link></button>
        </div>
      </div>
    </div>
  )
};

export default MainScreen;

