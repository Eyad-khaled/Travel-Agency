import { Link, useLocation } from "react-router-dom";


const Header = ({ title, desc ,button , link}) => {
  const location = useLocation();
  const isMain = location.pathname === "/";
  return (
    <header className="header ">
      <article>
        <h1
          className={`text-dark-100 ${
            isMain
              ? `text-2xl md:text-4xl font-bold`
              : `text-xl md:text-2xl font-semibold`
          }`}
        >
          {title}
        </h1>
        <p className={`text-gray-100 font-normal   md:text-lg ${isMain ? `text-base` : `text-small `}`}>{desc}</p>
      </article>

      {button && link &&  <Link to={link}>
      <button className=" md:w-[260px] w-full bg-[#256ff1] text-white font-xl p-[16px] rounded-full md:rounded-[25px] cursor-pointer flex justify-center items-center gap-[5px] " ><img src="../public/assets/icons/plus.svg" alt="" className="size-5" /><span>{button}</span> </button>
      </Link>}
     
    </header>
  );
};

export default Header;
