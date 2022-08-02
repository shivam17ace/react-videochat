import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const MainScreen = React.lazy(() => import("../screens/MainScreen"));
const CreateRoom = React.lazy(() => import("../components/CreateRoom/createRoom"));

function Routef() {
    return(
        <div>
            <Suspense
                fallback={ <div className="load_parent">
                <div className="loaderss"></div>
            </div>}
            >
                <Routes>
                    <Route path="/" element={<MainScreen />} />
                    <Route path="createroom" element={<CreateRoom />} />
                </Routes>
            </Suspense>
        </div>
    )
}
export default Routef;