import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sidebarItems } from "../app/constants";
import { logoutUser, getExistingUser } from "../app/appwrite/auth";
import { avatars } from "../app/appwrite/client";


const NavItems = ({ handleClick }) => {
  const [user, setUser] = useState < userType | null > (null);

  const navigate = useNavigate();
  const logOut = async () => {
    await logoutUser();
    navigate("/sign-in");
  };
  const [img, setImg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const existingUser = await getExistingUser();

        let profileImgUrl = existingUser?.imgUrl;
        if (!existingUser) {
          setUser(null);
          return;
        }

        profileImgUrl = user?.imageUrl || avatars.getInitials(existingUser?.name);

        setImg(profileImgUrl);

        setUser(existingUser);
      } catch (e) {
        console.error("Error loading user in NavItems:", e);
      }
    };

    load();
  }, []);

  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img
          src="../public/assets/icons/logo.svg"
          alt="Logo"
          className="size-[30px]"
        />
        <h1>Tourvisto</h1>
      </Link>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink key={id} to={href}>
              {({ isActive }) => (
                <div
                  className={`group nav-item ${isActive ? "bg-primary-100 !text-white" : ""
                    }`}
                  onClick={() => handleClick?.()}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0  group-hover:invert ${isActive ? "brightness-0 invert" : "text-dark-200"
                      }`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <footer className="nav-footer">
          <img src={img} alt={user?.name ?? "User"} />
          <article>
            <h2>{user?.name ?? "Guest"}</h2>
            <p>{user?.email ?? ""}</p>
          </article>
          <button onClick={logOut} className="cursor-pointer">
            <img
              referrerPolicy="no-referrer"
              src="../public/assets/icons/logout.svg"
              alt="Log Out"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItems;
