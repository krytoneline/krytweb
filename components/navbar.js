import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { TiArrowSortedUp } from "react-icons/ti";
import { useContext } from "react";
import { cartContext, categoryContext, languageContext, userContext } from "@/pages/_app";
import Swal from "sweetalert2";
// import * as rdd from "react-device-detect";
import { LuLogIn } from "react-icons/lu";
import { Api } from "@/services/service";
import { FaSortUp } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
// import { MdNavigateNext } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { Drawer, Typography, IconButton, Button } from '@mui/material';
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaCircleChevronUp } from "react-icons/fa6";
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IoIosSearch } from "react-icons/io";
import Categoriess from "./Categoriess";
import ProductCard from "./ProductCard";
import Badge from '@mui/material/Badge';
import { useTranslation } from "react-i18next";
import ConfirmationModal from "./ConfirmationModel";
import { TbCategory } from "react-icons/tb";


const Navbar = (props) => {
  const [navbar, setNavbar] = useState(false);
  const [showHover, setShowHover] = useState(true);
  const [showSub, setShowSub] = useState("");
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [cartData, setCartData] = useContext(cartContext);
  const [services, setServices] = useState([]);
  const [list, setList] = useState([
    { href: "/profile", title: "Profile" },
    { href: "/history", title: "History" },
  ]);
  const [currentCity, setCurrentCity] = useState('');
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
  const [serchData, setSearchData] = useState('')
  const [productsList, setProductsList] = useState([]);

  const [lang, setLang] = useState(null);
  const [globallang, setgloballang] = useContext(languageContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const [categoryType, setCategoryType] = useContext(categoryContext);

  const [signOutModel, setSignOutModel] = useState(false);

  useEffect(() => {
    getCategory()
  }, [])

  const getproductByCategory = async (text) => {
    let parmas = {}
    let url = `productsearch?key=${text}`

    Api("get", url, "", router, parmas).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        setProductsList(res.data)
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };



  const closeDrawer = async () => {
    setShowCategory(false);
  }

  const openDrawer = async () => {
    setShowCategory(true)
  };


  const closeDrawer1 = async () => {
    inputRef1.current.blur();
    setTimeout(() => {
      setShowCategory1(false);
    }, 500);
  }

  const getCategory = async () => {
    props.loader(true);
    Api("get", "getCategory", "", router).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        const d = []
        res.data.forEach(element => {
          d.push({
            href: `/categories?cat_id=${element._id}`, title: element?.name
          })
        });
        setServices(d);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
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

  useEffect(() => { }, [user])
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
      {!props.show &&
        <div className="bg-custom-orange w-full justify-center h-[60px] md:flex hidden">
          <div className="relative flex justify-center">
            <img className="" src="/image.png" />
            <p className="text-white font-bold text-[26px] w-full flex justify-center absolute top-[12px] left-[10px]">{t("SAVE FOR SURE")}<span className="text-[24px] text-white font-normal ml-10 "> {t("Lowest price in 90 days")}</span></p>
          </div>
          <div className="relative">
            <img className="-ml-[31px] h-[60px]" src="/image-1.png" />
          </div>
        </div>}
      {/* h-[157px]  */}
      <div className="bg-white w-full md:block hidden">
        {/* h-[130px] */}
        <div className="md:px-10 mx-auto w-full">

          {!props.show && <div className='flex justify-center items-center gap-5 pt-5'>
            <p className={`text-black cursor-pointer ${categoryType === 'Products' ? 'underline underline-offset-8 text-xl font-bold' : 'font-normal text-base '}`} onClick={() => { setCategoryType('Products'); }}>{t("Products")}</p>
            <p className={`text-black  cursor-pointer ${categoryType === 'Business' ? 'underline underline-offset-8 text-xl font-bold' : 'font-normal text-base '}`} onClick={() => { setCategoryType('Business'); }}>{t("Business")}</p>
          </div>}

          <div className="pt-5 pb-5 flex">
            <img className="w-[134px] h-[32px] cursor-pointer" src="/icons/main-logo.png" onClick={() => { router.push('/') }} />

            <div className="w-full flex justify-center items-center">
              <div className="border border-custom-darkRed rounded-[20px] h-[38px] w-[80%] flex justify-start items-center overflow-hidden">
                <input className="outline-none pl-5 text-xs font-normal text-black w-full" type="search" placeholder={t("Search for products...")} value={serchData}
                  onChange={(text) => {
                    setSearchData(text.target.value);
                  }} />
                <button className="text-white font-semibold text-sm	bg-custom-darkRed h-full w-[140px]" onClick={() => { router.push(`/search/${serchData}`); }}>{t("Search")}</button>
              </div>
            </div>

            <div className="flex justify-start items-center ml-10">
              {user?.token === undefined && (<p className="text-[#00000080] text-[10px] font-normal cursor-pointer " onClick={() => { router.push('/auth/signIn') }}>{t("Sign in join for free")}</p>)}
              {user?.token !== undefined && (

                <div className="bg-custom-gray text-white  h-[40px] w-[40px] rounded-full  items-center justify-center md:justify-self-end cursor-pointer md:flex hidden relative group"
                  onClick={() => { setShowHover(true) }}
                >
                  <p className="font-bold text-white text-base	text-center capitalize">
                    {user?.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </p>
                  {showHover && (

                    <div
                      className={` lg:absolute top-4 right-0 lg:min-w-[250px] group-hover:text-black   hidden group-hover:lg:block hover:lg:block md:!z-50`}
                    >
                      <div className="bg-custom-gray  lg:shadow-inner z-10 rounded-md lg:mt-8 shadow-inner">
                        <TiArrowSortedUp
                          className={`group-hover:lg:block lg:hidden h-5 w-5 text-custom-gray  absolute top-5 right-0`}
                        />
                        <ul>
                          {user?.type === 'SELLER' && !user?.store && <li className="px-5 py-2 shadow-inner feature1 border-b-2 border-white">
                            <Link
                              href={"/store-create"}
                              onClick={() => {
                                setShowHover(false);
                              }}
                              className="block px-5  py-1  pl-0  text-white text-left font-semibold text-base"
                              aria-current="page"
                            >
                              {t("Create Store")}
                            </Link>
                          </li>}

                          {user?.type === 'SELLER' && user?.store && <li className="px-5 py-2 shadow-inner feature1 border-b-2 border-white">
                            <Link
                              href={"https://www.admin.krytonline.com/"}
                              target="_blank"
                              onClick={() => {
                                setShowHover(false);
                              }}
                              className="block px-5  py-1  pl-0  text-white text-left font-semibold text-base"
                              aria-current="page"
                            >
                              {t("My Store")}
                            </Link>
                          </li>}

                          <li className="px-5 py-2 shadow-inner feature1 border-b-2 border-white">
                            <Link
                              href={"/favourite"}
                              // target="_blank"
                              onClick={() => {
                                setShowHover(false);
                              }}
                              className="block px-5  py-1  pl-0  text-white text-left font-semibold text-base"
                              aria-current="page"
                            >
                              {t("My Favourite")}
                            </Link>
                          </li>
                          <li className="px-5 py-2 shadow-inner feature1 border-b-2 border-white">
                            <Link
                              href={"/profile"}
                              // target="_blank"
                              onClick={() => {
                                setShowHover(false);
                              }}
                              className="block px-5  py-1  pl-0  text-white text-left font-semibold text-base"
                              aria-current="page"
                            >
                              {t("My Profile")}
                            </Link>
                          </li>

                          <li className="px-5 shadow-inner feature1  py-2">
                            <div
                              onClick={() => {
                                setSignOutModel(true)
                                // Swal.fire({
                                //   title: "Are you sure?",
                                //   text: "Do you want to signout?",
                                //   icon: "warning",
                                //   showCancelButton: true,
                                //   cancelButtonColor: "#d33",
                                //   confirmButtonText: "Yes",
                                //   cancelButtonText: "No",
                                // }).then(function (result) {
                                //   if (result.isConfirmed) {
                                //     setUser({})
                                //     setShowHover(false);
                                //     localStorage.removeItem(
                                //       "userDetail"
                                //     );
                                //     localStorage.removeItem("token");
                                //     router.push('/auth/signIn')
                                //   }
                                // })
                              }}

                              className="block px-5 py-1  pl-0 text-white text-left font-semibold text-base"
                              aria-current="page"
                            >
                              {t("Sign out")}
                            </div>

                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                </div>
              )}
              <div className="flex flex-col justify-center items-center mx-10 cursor-pointer" onClick={() => { router.push('/orders') }}>
                <img className="w-[20px] h-[20px]" src="/order-icon.png" />
                <p className="text-[#00000080] text-[10px] font-normal pt-1">{t("Orders")}</p>
              </div>

              <div className="flex flex-col justify-center items-center cursor-pointer" onClick={() => { router.push('/cart') }}>
                <Badge badgeContent={cartData.length} color="primary">
                  <img className="w-[20px] h-[20px]" src="/shopping-cart.png" />
                </Badge>
                <p className="text-[#00000080] text-[10px] font-normal pt-1">{t("Cart")}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-t-[#D6B6B666] flex justify-between items-center pt-[2px] pb-[2px]">
            {!showCategory && <div className="flex justify-center items-center cursor-pointer" onClick={openDrawer}>
              <img className="w-[24px] h-[24px]" src="/list.png" />
              <p className="text-black font-normal text-xs ml-3">{t("Categories")}</p>
            </div>}

            <Drawer open={showCategory} onClose={closeDrawer} >
              <div className='w-[310px] relative'>
                <div className="flex items-center justify-between border-b border-custom-newLightGray p-5">
                  <p className='text-black text-2xl font-normal'>{t("Categories")}</p>
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

            <div className="flex">
              <select className="bg-white w-full px-5  font-normal text-xs text-black outline-none" type="text" placeholder="English"
                value={lang}
                onChange={(e) => handleClick(e.target.value)}
              >
                <option value={"en"}>English</option>
                <option value={"fr"}>French</option>
              </select>
            </div>

          </div>
        </div >
      </div>
      {!props.show &&
        <div className='bg-custom-lightBlue h-[44px] md:flex justify-center items-center hidden cursor-pointer' onClick={() => { router.push('/faq') }}>
          <div className="md:px-10 mx-auto w-full flex justify-center items-center">
            <div className="w-[24px] h-[24px] rounded-full bg-custom-blue flex justify-center items-center">
              <IoLocation className="text-white h-4 w-4" />
            </div>
            <p className="text-black text-sm font-normal ml-5 cursor-pointer">{t("See FAQs if you have any kind of Questions and doubts.")}</p>
            <div className="ml-20 flex justify-center items-center">
              <p className="text-black text-sm font-normal">{t("Learn more")}</p>
              <MdNavigateNext className="text-[#00000080] w-[20px] h-[20px" />
            </div>
          </div>
        </div>}

      {/* mobile view */}
      <div className='md:hidden flex flex-row justify-between items-center gap-5'>
        <img className="w-[134px] h-[38px] cursor-pointer object-contain" src="/icons/main-logo.png" onClick={() => { router.push('/') }} />
        <div className="border border-custom-darkRed rounded-[10px] h-[38px] w-[38px] flex justify-center items-center overflow-hidden" ref={inputRef1} onClick={() => {
          setShowCategory1(true)
          setTimeout(() => {
            inputRef2.current.focus();
          }, 200);
        }}>
          <IoIosSearch className="w-5 h-5 text-[#00000060]" />
        </div>
      </div>
      {/* mobile view */}

      <Drawer open={showCategory1} anchor="top" onClose={closeDrawer1} >
        <div className='md:px-10 mx-auto w-full  relative'>
          <div className="md:px-0 px-5 py-5 flex justify-start items-center gap-5">
            <div className="flex items-center justify-start border border-custom-newLightGray rounded-[20px] h-[38px] w-full gap-5 overflow-hidden">
              <input className="outline-none pl-5 text-xs font-normal text-black w-full" type="search" placeholder={t("Search for products...")}
                ref={inputRef2}
                value={serchData}
                onChange={(text) => {
                  setSearchData(text.target.value);
                }} />
              <button className="text-white font-semibold text-sm	bg-custom-darkRed h-full w-[140px]" onClick={() => { router.push(`/search/${serchData}`); setShowCategory1(false); }}>{t("Search")}</button>
            </div>
            <IconButton variant="text" color="blue-gray" onClick={() => { setShowCategory1(false); setSearchData('') }}>
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
      <ConfirmationModal open={signOutModel} onClose={() => { setSignOutModel(false) }} onConfirm={() => {
        setUser({})
        setShowHover(false);
        localStorage.removeItem(
          "userDetail"
        );
        setSignOutModel(false)
        localStorage.removeItem("token");
        router.push('/auth/signIn')
      }}
        title='Are you sure?'
        description='Do you want to signout?'
      />
    </nav >
  );
};

export default Navbar;
