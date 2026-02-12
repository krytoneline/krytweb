import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { TiArrowSortedUp } from "react-icons/ti";
import { useContext } from "react";
import {
  cartContext,
  categoryContext,
  languageContext,
  userContext,
} from "@/pages/_app";
import { Api } from "@/services/service";
import { Store, Heart, User, LogOut, ShoppingBag } from "lucide-react";
// import { TiArrowSortedUp } from "react-icons/ti";
import { Drawer, Typography, IconButton, Button } from "@mui/material";
import Categoriess from "./Categoriess";
import Badge from "@mui/material/Badge";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "./ConfirmationModel";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { IoIosSearch } from "react-icons/io";

const Navbar = (props) => {
  const [navbar, setNavbar] = useState(false);
  const [showHover, setShowHover] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useContext(userContext);
  const [cartData, setCartData] = useContext(cartContext);
  const [services, setServices] = useState([]);
  const [list, setList] = useState([
    { href: "/profile", title: "Profile" },
    { href: "/history", title: "History" },
  ]);
  const [currentCity, setCurrentCity] = useState("");
  // const [commonCity, setCommonCity] = useContext(cityContext)
  // const [initial, setInitial] = useContext(Context)
  // const [mobile, setMobile] = useState(false);

  // useEffect(() => {
  //   setMobile(rdd.isMobile);
  //   if (rdd.isBrowser) {
  //     setToggleDrawer(true);
  //   }
  // }, [mobile]);

  const [showCategory, setShowCategory] = React.useState(false);
  const [showCategory1, setShowCategory1] = React.useState(false);
  const [openData, setOpenData] = React.useState(false);
  const [openColor, setOpenColor] = React.useState(false);
  const [openPrice, setOpenPrice] = React.useState(false);
  const [openBrand, setOpenBrand] = React.useState(false);
  const [openGender, setOpenGender] = React.useState(false);

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const [searchData, setSearchData] = useState("");
  const [productsList, setProductsList] = useState([]);

  const [lang, setLang] = useState(null);
  const [globallang, setgloballang] = useContext(languageContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const [categoryType, setCategoryType] = useContext(categoryContext);

  const [signOutModel, setSignOutModel] = useState(false);

  useEffect(() => {
    getCategory();
  }, []);

  const getproductByCategory = async (text) => {
    let parmas = {};
    let url = `productsearch?key=${text}`;

    Api("get", url, "", router, parmas).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        setProductsList(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const closeDrawer = async () => {
    setShowCategory(false);
  };

  const openDrawer = async () => {
    setShowCategory(true);
  };

  const closeDrawer1 = async () => {
    inputRef1.current.blur();
    setTimeout(() => {
      setShowCategory1(false);
    }, 500);
  };

  const getCategory = async () => {
    props.loader(true);
    Api("get", "getCategory", "", router).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        const d = [];
        res.data.forEach((element) => {
          d.push({
            href: `/categories?cat_id=${element._id}`,
            title: element?.name,
          });
        });
        setServices(d);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const menuItems = [
    {
      href: `/`,
      title: "Home",
      sub: false,
    },
    {
      href: "/categories",
      title: "Categories",
      sub: true,
      list: services,
    },
    {
      href: "/blogs",
      title: "Blogs",
      sub: false,
    },
    {
      href: "/custom-made",
      title: "Custom made",
      sub: false,
    },
    {
      href: "/contact",
      title: "Contact us",
      sub: false,
    },
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchData.trim()) {
      const targetPath = `/search/${searchData}`;
      if (router.asPath !== targetPath) {
        router.push(targetPath).then(() => setSearchData(""));
      }
    }
  };

  useEffect(() => {}, [user]);
  // console.log(props?.user);

  function handleClick(idx) {
    try {
      setLang(idx);
      const language = idx || "en";
      // console.log(language);
      i18n.changeLanguage(language);
      setgloballang(language);
      localStorage.setItem("LANGUAGE", language);
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    // md:h-[261px]
    <nav className="flex flex-col justify-center  min-h-max h-auto drop-shadow-md bg-white w-full z-50 md:p-0 p-3">
      {/* md:h-[234px]  */}
      {!props.show && (
        <div className="bg-black w-full justify-center h-[45px] md:flex hidden ">
          <div className="relative flex justify-center">
            <p className="text-white font-bold text-[18px] w-full flex items-center justify-center ">
              {t("SAVE FOR SURE")}
              <span className="text-[16px] text-white font-normal ml-4">
                {t("Lowest price in 90 days")}
              </span>
            </p>
          </div>
        </div>
      )}
      {/* h-[157px]  */}
      <div className="bg-white w-full md:block hidden">
        <div className="md:px-0 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-12 w-full py-4 items-center justify-between">
            <img
              className="w-[134px] h-[32px] col-span-2 cursor-pointer"
              src="/icons/main-logo.png"
              onClick={() => {
                router.push("/");
              }}
            />

            <div className="col-span-6 xl:col-span-8 w-full flex justify-center items-center">
              <div className="border border-custom-darkRed rounded-[20px] h-[38px] w-[90%] 2xl:w-[80%] flex justify-start items-center overflow-hidden">
                <input
                  className="outline-none pl-5 text-xs font-normal text-black w-full"
                  type="search"
                  placeholder={t("Search for products...")}
                  value={searchData}
                  onChange={(text) => {
                    setSearchData(text.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="text-white font-semibold text-sm	bg-custom-darkRed h-full w-[140px]"
                  onClick={() => {
                    router.push(`/search/${searchData}`);
                  }}
                >
                  {t("Search")}
                </button>
              </div>
            </div>

            <div className="col-span-3 xl:col-span-2 flex gap-4 2xl:gap-6 justify-end items-center w-full">
              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {
                  router.push("/orders");
                }}
              >
                <img className="w-[20px] h-[20px]" src="/order-icon.png" />
                <p className="text-[#00000080] text-sm font-normal pt-1">
                  {t("Orders")}
                </p>
              </div>

              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {
                  router.push("/cart");
                }}
              >
                <Badge badgeContent={cartData.length} color="primary">
                  <img className="w-[20px] h-[20px]" src="/shopping-cart.png" />
                </Badge>
                <p className="text-[#00000080] text-sm font-normal pt-1">
                  {t("Cart")}
                </p>
              </div>
              {user?.token === undefined && (
                <div
                  className="flex flex-col justify-center items-center cursor-pointer"
                  onClick={() => {
                    router.push("/auth/signIn");
                  }}
                >
                  <UserRound className="text-gray-600" />
                  <p className="text-[#00000080] text-sm font-normal cursor-pointer">
                    {t("Sign in")}
                  </p>
                </div>
              )}

              {user?.token !== undefined && (
                <div
                  className="bg-black/60 text-white  h-[40px] w-[40px] rounded-full  items-center justify-center md:justify-self-end cursor-pointer md:flex hidden relative group"
                  onClick={() => {
                    setShowHover(true);
                  }}
                >
                  <p className="font-bold text-white text-base	text-center capitalize">
                    {user?.username?.charAt(0).toUpperCase()}
                  </p>
                  {showHover && (
                    <div className="lg:absolute top-4 right-0 lg:min-w-[260px] hidden group-hover:lg:block z-50">
                      <div className="relative bg-black/60 backdrop-blur-[120px] rounded-xl shadow-2xl mt-8 overflow-hidden border border-white/10">
                        {/* Arrow */}
                        <TiArrowSortedUp className="absolute -top-3 right-4 h-6 w-6 text-black/60" />

                        <ul className="py-2 text-sm">
                          {/* Create Store */}
                          {user?.type === "SELLER" && !user?.store && (
                            <li className="hover:bg-white/10 transition">
                              <Link
                                href="/store-create"
                                onClick={() => setShowHover(false)}
                                className="flex items-center gap-3 px-5 py-3 text-white font-medium"
                              >
                                <Store size={18} />
                                <span>{t("Create Store")}</span>
                              </Link>
                            </li>
                          )}

                          {/* My Store */}
                          {user?.type === "SELLER" && user?.store && (
                            <li className="hover:bg-white/10 transition">
                              <Link
                                href="https://www.admin.krytonline.com/"
                                target="_blank"
                                onClick={() => setShowHover(false)}
                                className="flex items-center gap-3 px-5 py-3 text-white font-medium"
                              >
                                <ShoppingBag size={18} />
                                <span>{t("Dashboard")}</span>
                              </Link>
                            </li>
                          )}

                          <li className="hover:bg-white/10 transition">
                            <Link
                              href="/favourite"
                              onClick={() => setShowHover(false)}
                              className="flex items-center gap-3 px-5 py-3 text-white font-medium"
                            >
                              <Heart size={18} />
                              <span>{t("My Favourite")}</span>
                            </Link>
                          </li>

                          {/* Profile */}
                          <li className="hover:bg-white/10 transition">
                            <Link
                              href="/profile"
                              onClick={() => setShowHover(false)}
                              className="flex items-center gap-3 px-5 py-3 text-white font-medium"
                            >
                              <User size={18} />
                              <span>{t("My Profile")}</span>
                            </Link>
                          </li>

                          {/* Sign Out */}
                          <li className="border-t border-white/10 mt-1 hover:bg-red-500/10 transition">
                            <div
                              onClick={() => setSignOutModel(true)}
                              className="flex items-center gap-3 px-5 py-3 text-red-400 font-medium cursor-pointer"
                            >
                              <LogOut size={18} />
                              <span>{t("Sign out")}</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-t-[#D6B6B666] flex justify-between items-center pt-[2px] pb-[2px]">
            {!showCategory && (
              <div
                className="flex justify-center items-center cursor-pointer"
                onClick={openDrawer}
              >
                <img className="w-[24px] h-[24px]" src="/list.png" />
                <p className="text-black font-normal text-xs ml-3">
                  {t("Categories")}
                </p>
              </div>
            )}

            <div className="flex justify-center items-center gap-5 pt-2 pb-2">
              <p
                className={`text-black cursor-pointer ${
                  categoryType === "Products"
                    ? "underline underline-offset-8 text-xl font-bold"
                    : "font-normal text-base "
                }`}
                onClick={() => {
                  setCategoryType("Products");
                }}
              >
                {t("Products")}
              </p>
              <p
                className={`text-black  cursor-pointer ${
                  categoryType === "Business"
                    ? "underline underline-offset-8 text-xl font-bold"
                    : "font-normal text-base "
                }`}
                onClick={() => {
                  setCategoryType("Business");
                }}
              >
                {t("Business")}
              </p>
            </div>

            <div className="flex">
              <select
                className="bg-white w-full px-5  font-normal text-xs text-black outline-none"
                type="text"
                placeholder="English"
                value={lang}
                onChange={(e) => handleClick(e.target.value)}
              >
                <option value={"en"}>English</option>
                <option value={"fr"}>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white ">

        <img
          className="w-[120px] h-[34px] object-contain cursor-pointer"
          src="/icons/main-logo.png"
          alt="logo"
          onClick={() => router.push("/")}
        />

      
        <div className="flex items-center gap-3">
    
          <div
            className="h-9 w-9 flex items-center justify-center rounded-full border border-black/20 bg-white active:scale-95 transition"
            ref={inputRef1}
            onClick={() => {
              setShowCategory1(true);
              setTimeout(() => {
                inputRef2.current.focus();
              }, 200);
            }}
          >
            <IoIosSearch className="w-6 h-6 text-black/70" />
          </div>

          <div className="border border-black/20 rounded-lg px-1 py-1 bg-white">
            <select
              className="bg-transparent text-xs font-medium text-black outline-none cursor-pointer"
              value={lang}
              onChange={(e) => handleClick(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>
      </div>

      <Drawer open={showCategory1} anchor="top" onClose={closeDrawer1}>
        <div className="md:px-10 mx-auto w-full  relative">
          <div className="md:px-0 px-5 py-5 flex justify-start items-center gap-5">
            <div className="flex items-center justify-start border border-custom-newLightGray rounded-[20px] h-[38px] w-full gap-5 overflow-hidden">
              <input
                className="outline-none pl-5 text-sm font-normal text-black w-full"
                type="search"
                placeholder={t("Search for products...")}
                ref={inputRef2}
                value={searchData}
                onChange={(text) => {
                  setSearchData(text.target.value);
                }}
              />
              <button
                className="text-white font-semibold text-sm	bg-custom-darkRed h-full w-[140px]"
                onClick={() => {
                  router.push(`/search/${searchData}`);
                  setShowCategory1(false);
                }}
              >
                {t("Search")}
              </button>
            </div>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => {
                setShowCategory1(false);
                setSearchData("");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
        </div>
      </Drawer>
      <ConfirmationModal
        open={signOutModel}
        onClose={() => {
          setSignOutModel(false);
        }}
        onConfirm={() => {
          setUser({});
          setShowHover(false);
          localStorage.removeItem("userDetail");
          setSignOutModel(false);
          localStorage.removeItem("token");
          router.push("/auth/signIn");
        }}
        title="Are you sure?"
        description="Do you want to signout?"
      />
      <Drawer open={showCategory} onClose={closeDrawer}>
        <div className="w-[310px] relative">
          <div className="flex items-center justify-between border-b border-custom-newLightGray p-5">
            <p className="text-black text-2xl font-normal">{t("Categories")}</p>
            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <div className="pb-[70px]  p-5">
            <Categoriess setShowCategory={setShowCategory} />
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
