/* eslint-disable react-hooks/exhaustive-deps */
import Footer from "./Footer";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { userContext } from "../pages/_app";
import Navbar from "./navbar";
import { IoList } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
// import * as rdd from "react-device-detect";
import MobileFooter from "./MobileFooter";

const Layout = ({ children, loader, toaster, constant }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  // console.log(router)
  const [open, setOpen] = useState(false);
  const [organizationOpen, setOrganizationOpen] = useState(false);
  const [orgList, setOrgList] = useState([]);
  const [toggleDrawer, setToggleDrawer] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [userName, setUserName] = useState("ADMIN");

  const menuItems = [
    // {
    //   href: "/myProfile/dashboard",
    //   title: "Dashboard"
    // },
    {
      href: "/myProfile/profile",
      title: "Profile"
    },
    {
      href: "/myProfile/history",
      title: "My Booking"
    },
    // {
    //   href: "/myProfile/my-booking",
    //   title: "All Booking"
    // },
    // {
    //   href: "/myProfile/notifications",
    //   title: "Notifications"
    // },
    {
      href: "/myProfile/changePassword",
      title: "Change Password"
    },
    {
      href: "/",
      title: "Signout"
    },
  ];

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // useEffect(() => {
  //   setMobile(rdd.isMobile);
  //   if (rdd.isBrowser) {
  //     setToggleDrawer(true);
  //   }
  // }, [mobile]);



  useEffect(() => {

    router.events.on("routeChangeComplete", () => {
      loader(false);
    });
    router.events.on("routeChangeStart", () => {
      loader(true);
    });
    loader(false);
  }, []);
  //console.log(router.pathname === '/demo')

  const handleClose = () => {
    setOpen(false);
    setOrganizationOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // console.log(window.scrollY)
      if (window.scrollY > 260) {
        // setShow(window.scrollY < lastScrollY);
        // Show when scrolling up
        setShow(true);

      } else {
        setShow(false);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  return (
    <>
      {!mobile && router.route.includes('myProfile') && <div className="md:min-h-screen flex sm:flex-1 flex-col">
        {router.route !== "/" && router.route !== "/signup" && (
          <header className={`bg-black fixed top-0 w-full h-16 flex  font-semibold uppercase shadow-lg z-30 ${toggleDrawer ? "ml-60" : "ml-0"}`}>
            <div className="flex justify-center items-center  ">
              {mobile && (
                <IoList
                  className="text-custom-blue h-8 w-8 mx-5"
                  onClick={() => {
                    setToggleDrawer(!toggleDrawer);
                  }}
                />
              )}
              <div className={`flex-1  justify-center items-center ${toggleDrawer ? "hidden md:flex" : "flex"}`}>
                <div className="h-8 w-8 relative ml-0 md:ml-10  ">
                  <Image
                    src={user?.profile || "/images.png"}
                    alt="icon"
                    layout="fill" // required
                    objectFit="cover"
                    className="rounded-full"
                  ></Image>
                </div>
                <h2 className="text-xs text-white font-bold ml-2 uppercase ">
                  {userName}
                </h2>
              </div>

              <div
                className={`flex-1  fixed right-5 justify-end ${toggleDrawer ? "hidden md:flex" : "flex"}`}>
                <div
                  className="flex-1 flex justify-center item-center cursor-pointer"
                  onClick={handleClickOpen}>
                </div>
              </div>
            </div>
          </header>
        )}

        <aside className={`bg-black w-60  fixed  min-h-screen z-40 border-r-2 border-custom-lightBlu`}>
          <div className=" w-60 h-60 p-4   flex justify-center items-center  border-b-2 border-custom-lightBlue">
            <img onClick={() => router.push("/")} src="/logo.png" className="rounded-md overflow-hidden" />
          </div>

          <nav>
            <ul>
              {menuItems.map((item) => (
                <div key={item.title}>
                  <li
                    className="py-2  flex  px-5 align-middle "
                    // border-b-2 border-custom-lightBlue
                    onClick={() => {
                      // router.push(item.href);
                      // if (mobile) {
                      //   setToggleDrawer(!toggleDrawer);
                      // }
                    }}
                  >
                    {item?.title === "Signout" ? (
                      <div
                        onClick={() => {
                          setUser({});
                          localStorage.removeItem(
                            "userDetail"
                          );
                          localStorage.removeItem("token");
                          router.push('/')
                        }}
                        className="block font-nunito font-semibold hover:font-bold md:text-md cursor-pointer  text-lg py-1  pl-0  text-white  hover:hover:text-custom-yellow text-left  hover:border-b-2 hover:border-custom-yellow "
                      >
                        {item.title}
                      </div>
                    ) : (
                      <Link href={item.href}>
                        <p className={`${router.route === item.href ? 'text-custom-yellow border-b-2 border-custom-yellow' : 'text-white'} font-nunito font-semibold hover:font-bold md:text-md cursor-pointer  text-lg py-1  pl-0    hover:hover:text-custom-yellow text-left`}
                        >
                          {item.title}

                        </p>
                      </Link>
                    )}
                  </li>
                </div>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex flex-col md:flex-row z-0 bg-white h-screen">
          <main
            className={
              router.route !== "/" &&
                router.route !== "/signup" &&
                toggleDrawer &&
                user?.id !== "6450e9bef4d2cc08c2ec0431"
                ? " md:pl-60 md:w-full  md:pt-16"
                : "flex-1"
            }
          >
            {children}
          </main>
        </div>
      </div>}
      {/* || !router.route.includes('myProfile')  */}
      {(mobile || !router.route.includes('myProfile')) && <div>
        <div className=" flex-1 flex-col bg-white">
          <header
            className={`fixed top-0 left-0 !w-full  !z-50 transition-transform duration-500 ${show ? "translate-y-0" : "-translate-y-full"
              } bg-white shadow-md `}
          >
            <div className="!z-50  w-full top-0">
              {
                !router.pathname.includes('/booking/service-detail') && !router.route.includes('error') &&
                <Navbar
                  user={user}
                  setUser={setUser}
                  loader={loader}
                  toaster={toaster}
                  show={true}
                />
              }
            </div>
          </header>
          <header className="!z-50  w-full overflow-visible">
            {
              !router.pathname.includes('/booking/service-detail') && !router.route.includes('error') &&
              <Navbar
                user={user}
                setUser={setUser}
                loader={loader}
                toaster={toaster}
                show={false}
              />
            }
          </header>
          {/* md:pt-[261px] pt-16 */}
          <div className={!router.route.includes('error') ? `!-z-40  max-w-screen overflow-x-hidden ` : '  '} onScroll={(event) => {
            console.log(event)
          }}>
            {/* md:min-h-screen  */}
            <main className={"flex-1 !z-0"}>{children}</main>
          </div>
        </div>
        {
          !router.pathname.includes('/booking/service-detail') && !router.route.includes('error') &&
          <Footer loader={loader} toaster={toaster} />
        }
        {!mobile && !router.route.includes('error') &&
          <div className="md:hidden flex-1 flex-col relative bg-white ">
            <div className="!z-50 fixed w-full bottom-0">
              <MobileFooter />
            </div>
          </div>}
      </div>}
    </>
  );
};

export default Layout;
