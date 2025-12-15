import { Link, useLocation } from "react-router-dom";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "../app/lib/utils";



const TripCard = ({ id, name, imageurl, location, tags, price }) => {
  const path = useLocation();
  return (
    <Link
      to={
        path.pathname === "/" || path.pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="trip-card"
    >
      <img src={imageurl} alt={name} />
      <article>
        <h2>{name}</h2>
        <div className="fig flex gap-2 py-2 items-center">
          <figure>
            <img
            loading="lazy"
              src="../public/assets/icons/location-mark.svg"
              alt="location"
              className="size-4"
            />
          </figure>
          <figcaption>{location}</figcaption>
        </div>
      </article>

      <div className="mt-5 pl-[18px] pr-3.5 pb-5" >
        <ChipListComponent id="travel-chip">
          <ChipsDirective>
            {tags.map((tag, index) => {
              return (
                <ChipDirective
                  key={index}
                  text={getFirstWord(tag)}
                  cssClass={cn(
                    index === 1
                      ? `!bg-pink-50 !text-pink-500`
                      : `!bg-success-50 !text-success-700`
                  )}
                />
              );
            })}
          </ChipsDirective>
        </ChipListComponent>
      </div>

      <article className="tripCard-pill">{price}</article>
    </Link>
  );
};

export default TripCard;
