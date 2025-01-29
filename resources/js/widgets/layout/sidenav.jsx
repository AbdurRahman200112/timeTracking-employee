import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import img2 from "../../../img/logo.png";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export function Sidenav({ brandImg, brandName, routes }) {
  const topRoutes = routes
    .map((route) => {
      if (route.layout === "dashboard") {
        return { ...route, pages: route.pages.slice(0, 6) }; // Top 7 for dashboard
      } else if (route.layout === "auth") {
        return { ...route, pages: route.pages.slice(0, 1) }; // Top 1 for auth
      }
      return route; // Other layouts remain unchanged
    })
    .slice(0, 20) // Ensure only the top 20 routes are included
    .filter((route) => route.pages.length > 0); // Exclude layouts with no pages

  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeSidenavOnMobile = () => {
    if (window.innerWidth < 1280) {
      setOpenSidenav(dispatch, false);
    }
  };

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const buttonColors = {
    dark: "white",
    white: "blue-gray",
    transparent: "blue-gray",
  };

  const scrollbarStyle = {
    overflowY: "auto",
    height: "calc(100vh - 100px)",
    scrollbarWidth: "thin",
    scrollbarColor: "#FFF2D4 transparent",
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .sidenav-scroll::-webkit-scrollbar {
        width: 0.2px;
        height: 0.2px;
      }
      .sidenav-scroll::-webkit-scrollbar-thumb {
        background-color: orange;
        border-radius: 10px;
      }
      .sidenav-scroll::-webkit-scrollbar-track {
        background-color: transparent;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] ${window.innerWidth < 640 ? "w-72" : "w-80" // Use smaller width for mobile screens
        } rounded-xl transition-transform duration-300 xl:translate-x-0 shadow-xl overflow-hidden`}
    >
      <div className="relative flex items-center">
        <Link to="/" className="py-6 px-8 text-center">
          <img
            src={img2}
            alt="Brand Logo"
            className="h-12 w-full ml-3"
            style={{ height: "50px", width: "90%" }}
          />
        </Link>

        <IconButton
          variant="text"
          color="black"
          size="sm"
          ripple={false}
          className="absolute right-4 top-4 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-black" />
        </IconButton>
      </div>
      <div
        className="m-4 sidenav-scroll"
        style={{
          overflowY: "auto",
          height: "calc(100vh - 100px)",
          scrollbarWidth: "thin",
          scrollbarColor: "#FFF2D4 transparent",
        }}
      >
        {topRoutes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex text-black flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="text-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path, children }) => (
              <li key={name}>
                {children ? (
                  <>
                    <Button
                      onClick={() => toggleDropdown(name)}
                      style={{ boxShadow: "none" }}
                      className={`flex items-center text-black bg-white justify-between w-full px-4 ${openDropdown === name ? "bg-[#FFF2D4]" : ""
                        }`}
                    >
                      <span className="flex items-center gap-4">
                        {React.cloneElement(icon, {
                          className: "h-6 w-6 text-black-200",
                        })}
                        <Typography
                          color="inherit"
                          className="font-medium text-black-200 capitalize"
                        >
                          {name}
                        </Typography>
                      </span>
                      <span>
                        {openDropdown === name ? (
                          <IoIosArrowUp className="h-4 w-4" />
                        ) : (
                          <IoIosArrowDown className="h-4 w-4" />
                        )}
                      </span>
                    </Button>
                    {openDropdown === name && (
                      <ul className="ml-6 mt-2 flex flex-col gap-1">
                        {children.map(({ name: childName, path: childPath }) => (
                          <li key={childName}>
                            <NavLink
                              to={`/${layout}${childPath}`}
                              onClick={closeSidenavOnMobile}
                            >
                              {({ isActive }) => (
                                <Button
                                  variant={isActive ? "filled" : "text"}
                                  color={
                                    isActive
                                      ? sidenavColor
                                      : buttonColors[sidenavType]
                                  }
                                  className={`flex text-black items-center gap-4 px-4 capitalize ${isActive ? "bg-[#fff2d4]" : ""
                                    }`}
                                  fullWidth
                                >
                                  <Typography
                                    color={isActive ? "black" : "inherit"}
                                    className="font-medium capitalize"
                                  >
                                    {childName}
                                  </Typography>
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink to={`/${layout}${path}`} onClick={closeSidenavOnMobile}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "filled" : "text"}
                        color={
                          isActive ? sidenavColor : buttonColors[sidenavType]
                        }
                        className={`flex items-center gap-4 px-4 capitalize ${isActive ? "bg-[#fff2d4]" : ""
                          }`}
                        fullWidth
                      >
                        <span className="flex items-center gap-4">
                          {React.cloneElement(icon, {
                            className: "h-6 w-6 text-black",
                          })}
                          <Typography
                            color={isActive ? "black" : "inherit"}
                            className="font-medium capitalize"
                          >
                            {name}
                          </Typography>
                        </span>
                      </Button>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>


  );
}

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      layout: PropTypes.string,
      title: PropTypes.string,
      pages: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.node,
          name: PropTypes.string,
          path: PropTypes.string,
        })
      ),
    })
  ),
};
