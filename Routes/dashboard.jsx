import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import { allTrips, dashboardstats } from "../app/constants";
import TripCard from "../components/TripsCard";
import { motion } from "framer-motion";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import MobileBar from "../components/MobileBar";
import "../src/App.css";
import NavItems from "../components/NavItems";
import { getExistingUser } from "../app/appwrite/auth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTrips } from "../app/appwrite/allTrips";
import { parseMarkdownToJson } from "../app/lib/utils";

const user = await getExistingUser();

const Dashboard = () => {
   const [allTrips, setAllTrips] = useState({});
    
    useEffect(() => {
      
      const getTrip = async () => {
        const response = await getAllTrips();
        const normalizedTrips = response?.allTrips.slice(0,4)
          .map((trip) => ({
            ...trip,
            tripDetails: parseMarkdownToJson(trip.tripDetails),
          }));
  
        setAllTrips({trips:normalizedTrips});
        
        console.log('trips' , normalizedTrips);
        
      };
  
      getTrip();
    }, []);
  const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
    dashboardstats;
  return (
    <div className="admin-layout">
      <MobileBar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <main className="dashboard wrapper md:pt-10">
        <Header
          title={`Welcome ${user ? user.name.split(" ")[0] : "Guest"} 👋`}
          desc="Track Activity , trends and popular destinations"
          
        />
        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              headerTitle="Total Users"
              total={totalUsers}
              currentMonthCount={usersJoined.currentMonth}
              lastMonthCount={usersJoined.lastMonth}
            />
            <StatsCard
              headerTitle="Total Trips"
              total={totalTrips}
              currentMonthCount={tripsCreated.currentMonth}
              lastMonthCount={tripsCreated.lastMonth}
            />
            <StatsCard
              headerTitle="Active Users"
              total={userRole.total}
              currentMonthCount={userRole.currentMonth}
              lastMonthCount={userRole.lastMonth}
            />
          </div>
        </section>

        <section className="container">
          <h1 className="text-xl font-semibold text-dark-100">
            {" "}
            Created Trips
          </h1>
          <div className="trip-grid overflow-hidden">
                
                    {allTrips.trips?.map(({ $id, imageUrls, tripDetails }) => (
              <Link key={$id} to={`/trips/${$id}`}>
                <motion.div
                  key={$id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  viewport={{ once: false }}
                >
                <div
                  className=""
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                >
                  <TripCard
                    key={$id}
                    id={$id}
                    name={tripDetails?.name}
                    imageurl={imageUrls?.[0]}
                    location={tripDetails?.itinerary?.[0]?.location}
                    tags={[tripDetails?.interest, tripDetails?.travelStyle]}
                    price={tripDetails?.estimatedPrice}
                  />
                </div>
                </motion.div>
              </Link>
            ))}
                
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
