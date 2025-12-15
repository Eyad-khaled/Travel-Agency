import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllTrips, getTripById } from "../app/appwrite/allTrips";
import Header from "../components/Header";
import { getFirstWord, parseMarkdownToJson } from "../app/lib/utils";
import InfoPill from "../components/infoPill";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import MobileBar from "../components/MobileBar";
import NavItems from "../components/NavItems"; // you must import this
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import TripCard from "../components/TripsCard";


const TripDetails = () => {
  const currentId = useParams().tripId
  const [trip, setTrip] = useState({});
  const [imageUrls, setimageUrls] = useState([]); 
  const [allTrips, setAllTrips] = useState([]);
  const { tripId } = useParams();
  const pillItems = trip?.travelStyle
    ? [
        { text: trip.travelStyle, bg: "!bg-pink-50 !text-pink-500" },
        { text: trip.groupType, bg: "!bg-primary-50 !text-primary-500" },
        { text: trip.budget, bg: "!bg-success-50 !text-success-700" },
        { text: trip.interest, bg: "!bg-navy-50 !text-navy-500" },
      ]
    : [];

    const {
      travelStyle,
      groupType,
      budget,
      interest,
      duration,
      itinerary,
      name,
      country,
      description,
      bestTimeToVisit,
      weatherInfo,
      estimatedPrice
    } = trip;
  
    const weatherAndTimeVisit = [
      {text: 'Best Time To Visit :' , item: bestTimeToVisit},
      {text: 'Weather Info :' , item: weatherInfo},
    ]

 useEffect(() => {
   const getTrip = async () => {
    
     const tripData = await getTripById(tripId);
     const response = await getAllTrips();
     console.log(response);
     
     setimageUrls(tripData?.imageUrls || []);
     setTrip(parseMarkdownToJson(tripData?.tripDetails));
   console.log('id' ,currentId);
   console.log(response);
   
   

     const normalizedTrips = response.allTrips.filter((trip)=> trip.$id !== currentId).map((trip) => ({
       ...trip,
       tripDetails: parseMarkdownToJson(trip.tripDetails),
     }));

     setAllTrips(normalizedTrips);
   };

   getTrip();
 }, [tripId]);



  return (
    <div className="admin-layout">
      <MobileBar />

      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <main className="travel-detail wrapper md:pt-10">
        <Header
          title="Trip Details"
          desc="View And Edit AI-generated Travel Plans"
        />

        <section className="container wrapper-md">
          <header>
            <h1 className="p-40-semibold text-dark-100">{name}</h1>
          </header>

          <div className="flex items-center gap-5">
            <InfoPill
              title={`${duration} Days Plan`}
              image="../public/assets/icons/calendar.svg"
            />

            {itinerary?.length ? (
              <InfoPill
                title={[...new Set(itinerary.map((item) => item.location))]
                  .slice(0, 2)
                  .join(" , ")}
                image="../public/assets/icons/location-mark.svg"
              />
            ) : null}
          </div>

          <section className="gallery">
            {imageUrls.map((img, i) => (
              <img
                src={img}
                alt="Generated Image"
                key={i}
                className={`rounded-xl w-full object-cover ${
                  i === 0
                    ? "md:col-span-2 md:row-span-2 h-[330px]"
                    : "md:row-span-1 h-[150px]"
                }`}
              />
            ))}
          </section>
          <section className="flex gap-3 md:gap-5 items-center flex-wrap">
            <ChipListComponent id="travel-chip">
              <ChipsDirective>
                {pillItems.map((pill, index) => {
                  return (
                    <ChipDirective
                      key={index}
                      text={getFirstWord(pill.text)}
                      // cssClass={cn(
                      //   index === 1
                      //     ? `!bg-pink-50 !text-pink-500`
                      //     : `!bg-success-50 !text-success-700`
                      // )}
                      cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                    />
                  );
                })}
              </ChipsDirective>
            </ChipListComponent>

            <ul className="flex gap-1 items-center">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <li key={i}>
                    <img
                      src="../public/assets/icons/star.svg"
                      alt="star"
                      className="size-[18px]"
                    />
                  </li>
                ))}
              <li className="ml-1">
                <ChipListComponent id="travel-chip">
                  <ChipsDirective>
                    <ChipDirective
                      text="4.9 / 5"
                      cssClass="!bg-yellow-50 !text-yellow-700"
                    />
                  </ChipsDirective>
                </ChipListComponent>
              </li>
            </ul>
          </section>
          <section className="title">
            <article>
              <h3>
                {duration}-Day {country} {travelStyle} Trip
              </h3>
              <p>
                {budget} , {groupType} , {interest}
              </p>
            </article>
            <h2>{estimatedPrice}</h2>
          </section>
          <p className="text-sm md:text-lg font-normal text-dark-400">
            {description}
          </p>
          <ul className="itinerary">
            {itinerary?.map((dayplan, index) => (
              <li key={index}>
                <h3>
                  Day {dayplan.day} : {dayplan.location}
                </h3>
                <ul>
                  {dayplan.activities.map((activity, i) => (
                    <li key={i}>
                      <span className="flex-shrink-0 p-18-semibold">
                        {activity.time}{" "}
                      </span>
                      <p className="flex-grow">{activity.description}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {weatherAndTimeVisit.map((item) => (
            <section key={item.text}>
              <div>
                <h3>{item.text} </h3>
                <ul>
                  {item.item?.map((item, i) => (
                    <li key={i} className="py-2">
                      <p className="flex-grow">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
          <section className="flex flex-col gap-6">
            <h2 className="p-24-semibold text-dark-100"> Other Trips</h2>

            <div className="trip-grid-limited ">
              {allTrips.map(({ $id, imageUrls, tripDetails }) => (
                <Link to={`/trips/${$id}`}>
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
        </section>
      </main>
    </div>
  );
};

export default TripDetails;
