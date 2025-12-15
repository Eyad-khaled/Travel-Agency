// import { SidebarComponent } from '@syncfusion/ej2-react-navigations'
// import MobileBar from '../components/MobileBar'
// import './App.css'
// import NavItems from '../components/NavItems'
import { Route, Routes, useLocation, useNavigate , Link } from "react-router-dom";
// import {redirect} from 'react-router';
import Dashboard from "../Routes/dashboard";
import AllUsers from "../Routes/all-users";
import SignIn from "../Routes/sign-in";
import { account } from "../app/appwrite/client";
import { getExistingUser, storeUserData } from "../app/appwrite/auth";
import { useEffect } from "react";
import Trips from '../Routes/trips'
// import CreateTrips from '../Routes/createTrips'
import TripDetails from '../Routes/tripDetails'
import { lazy, Suspense } from "react";
const CreateTrips = lazy(() => import("../Routes/createTrips"));
function App() {
  const navigate = useNavigate();
  const location = useLocation();
   async function clientLoader() {
  
    try {
      const user = await account.get();
        
      if (!user) {
        return navigate("/sign-in");
      }
      if (user && location.pathname === "/sign-in") {
        return navigate("/dashboard");
      }
      if (user && location.pathname === "/") {
        return navigate("/dashboard");
      }
      const existingUser = await getExistingUser();
      //  console.log('existingUser in clientLoader', existingUser?.status);
      // if (existingUser?.status === "user") {
      //   return navigate("/dashboard");
      // }
  
  
      //  console.log('user',user);
  
      return existingUser?.$id ? existingUser : await storeUserData();
    } catch (e) {
      console.log("Error in client loader", e);
      return navigate("/sign-in");
    }
  }

  useEffect(() => {
    clientLoader();
  }, []);

  return (
    <div className="admin-layout">
      {/* <div className='admin-layout'>
    <MobileBar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>    */}
      {/* <aside className="children">
        <Outlet />
      </aside> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/trips/:tripId" element={<TripDetails />} />
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/api/create-trip" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/create" element={<CreateTrips />} />
        </Routes>
      </Suspense>
      {/* </div> */}
    </div>
  );
}

export default App;
