// import Header from "../components/Header";

// import {
//   MapsComponent,
//   LayersDirective,
//   LayerDirective,
// } from "@syncfusion/ej2-react-maps";
// import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
// import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import {
  ComboBoxComponent,
  MapsComponent,
  LayersDirective,
  LayerDirective,
  SidebarComponent,
} from "../src/syncfusion";
import MobileBar from "../components/MobileBar";
import "../src/App.css";
import NavItems from "../components/NavItems";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { comboBoxItems, selectItems } from "../app/constants";
import { formatKey } from "../app/lib/utils";
import { world_map } from "../app/constants/world_map";
import { account } from "../app/appwrite/client";
import {  useNavigate } from "react-router-dom";
import {action} from './api/create-trip'

const fetchCountries = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=countries,name,maps,latlng"
  );
  const data = await response.json();
  return data.map((e) => ({
    name: e.name.common,
    cordinates: e.latlng,
    value: e.name.common,
    openStreetMap: e.maps.openStreetMaps,
  }));
};
const CreateTrips = () => {
  const navigate = useNavigate();
  const [CountriesData, setCountriesData] = useState([]);

  const [FormData, setFormData] = useState({
    country: "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: "",
    groupType: "",
  });
  const handleChange = (key, value) => {
    setFormData({ ...FormData, [key]: value });
  };
  const [MapData, setMapData] = useState([{}]);
  const [allCountries, setAllCountries] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState(null);
  useEffect(() => {
    const loadCountries = async () => {
      const data = await fetchCountries();
      setAllCountries(data);
      setCountriesData(
        data.map((e) => ({
          text: e.name,
          value: e.value,
        }))
      );
    };
    loadCountries();
  }, []);
  useEffect(() => {
    
    const setForm = async () =>
      setFormData({
        country: allCountries[0] || "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: "",
        groupType: "",
      });
    setForm();
  }, [CountriesData]);
  useEffect(() => {
    const setMap = async () =>
      setMapData([
        {
          country: FormData.country,
          color: "#ea382e",
          coordinates: allCountries.find(
            (c) => c.name === FormData.country?.cordinates || []
          ),
        },
      ]);

    setMap();
  }, [FormData]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !FormData.country ||
      !FormData.budget ||
      !FormData.duration ||
      !FormData.groupType ||
      !FormData.interest || 
      !FormData.travelStyle
    ) {
      setError("Please Provide Data For All Fields");
      setLoading(false);
      return;
    }
    const user = await account.get();
    if (!user.$id) {
      // console.error("error generating trips");
      setLoading(false);
      return;
    }
    try {
     console.log('######################',);
       const response = await (action(FormData,setLoading))
      //  const result = await response.json()
      //  console.log('resulttt' ,result);
       if (response.$id) navigate(`/trips/${response.$id}`)
        else console.error(Error);
        
       console.log(response);
       
       
      //  const response = await action(FormDat a ,setLoading)
      //  console.log('heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee ', response);
       
      // if (result.id) {
      //   navigate(`/trips/${result.id}`);
      // } else {
      //   setError("Failed to generate trip");
      //   console.error("failed to generate trip");
      // }
    } catch (error) {
      setError("An error occurred while generating the trip");
      console.error(error);
    } 
  };
  return (
    <div className="admin-layout">
      <MobileBar />
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <main className="dashboard wrapper md:pt-10">
        <Header title="Add New Trips" desc="View And Generate Ai Trips" />
        <section className="mt-2.5 wrapper-md">
          <form action="" className="trip-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="country">country</label>
              <ComboBoxComponent
                id="country"
                dataSource={CountriesData}
                fields={{ text: "text", value: "value" }}
                placeholder="Select A Country"
                className="combo-box"
                allowFiltering
                change={(e) => {
                  if (e.value) {
                    handleChange("country", e.value);
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="duration">Duration</label>
              <input
                min={1}
                type="number"
                id="duration"
                placeholder="Enter A Number Of Days"
                name="duration"
                className="form-input placeholder:text-gray-100"
                onInput={(e) => {
                  const value = Number(e.currentTarget.value);
                  if (value < 0 || value > 10) {
                    e.currentTarget.value = "";
                    alert("enter a number of days between 1 And 10");
                  }
                }}
                onChange={(e) =>
                  handleChange("duration", Number(e.target.value))
                }
              />
            </div>
            {selectItems.map((key) => (
              <div key={key}>
                <label htmlFor={key}>{formatKey(key)}</label>
                <ComboBoxComponent
                  id={key}
                  dataSource={comboBoxItems[key]}
                  fields={{ text: key, value: key }}
                  placeholder={`Select A ${formatKey(key)}`}
                  className="combo-box"
                  allowFiltering
                  change={(e) => {
                    if (e.value) {
                      handleChange(key, e.value);
                    }
                  }}
                />
              </div>
            ))}
            <div>
              <label htmlFor="location">Location On World Map</label>
              <MapsComponent>
                <LayersDirective>
                  <LayerDirective
                    dataSource={MapData}
                    shapeData={world_map}
                    shapePropertyPath="name"
                    shapeDataPath="country"
                    shapeSettings={{
                      colorValuePath: "color",
                      fill: "#e5e5e5ff",
                    }}
                  />
                </LayersDirective>
              </MapsComponent>
            </div>
            <div className="bg-gray-200 h-px w-full"></div>
            {Error && (
              <div className="error">
                <p>{Error}</p>
              </div>
            )}

            <footer className="px-6">
              <button
                type="submit"
                className="button-class !h-12 !w-full"
                disabled={Loading}
              >
                <img
                  className={`size-5 ${Loading ? "animate-spin" : ""}`}
                  src={`../public/assets/icons/${
                    Loading ? "loader.svg" : "magic-star.svg"
                  }`}
                  alt=""
                />
                <span className="p-16-semibold text-white">
                  {Loading ? "Generating..." : "Generate Trip"}
                </span>
              </button>
            </footer>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateTrips;
