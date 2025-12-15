// import Header from "../components/Header";

import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import MobileBar from "../components/MobileBar";
import "../src/App.css";
import NavItems from "../components/NavItems";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { parseMarkdownToJson } from "../app/lib/utils";
import { getAllTrips } from "../app/appwrite/allTrips";
import TripCard from "../components/TripsCard";
import { Link} from "react-router-dom";



const Trips = () => {

  const [allTrips, setAllTrips] = useState({});
  
  useEffect(() => {
    
    const getTrip = async () => {
      const response = await getAllTrips();
      const normalizedTrips = response?.allTrips
        .map((trip) => ({
          ...trip,
          tripDetails: parseMarkdownToJson(trip.tripDetails),
        }));

      setAllTrips({trips:normalizedTrips});
      
      console.log('trips' , normalizedTrips);
      
    };

    getTrip();
  }, []);
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
          title="All Trips"
          desc="View And Generate Ai Trips"
          button="Create New Trips"
          link="/trips/create"
        />
        <section>
          <h1 className="p-24-semibold text-dark-100 mb-6">All Created Trips</h1>
          <div className="trip-grid mb-4 ">
            {allTrips.trips?.map(({ $id, imageUrls, tripDetails }) => (
              <Link key={$id} to={`/trips/${$id}`}>
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
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Trips;
