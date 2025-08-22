import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "@/components/loader";
import Head from "next/head";
import { IoIosCloseCircleOutline } from "react-icons/io";


import getip from "@/services/myip";
import CountryLanguage from "@ladjs/country-language";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "../ni18n.config";
export const languageContext = createContext();
import { useTranslation } from "react-i18next";
import constant from '@/services/constant';
import { Api } from "@/services/service";


export const userContext = createContext();
export const cartContext = createContext();
export const cartCompareContext = createContext();
export const categoryContext = createContext();
export const categoryListContext = createContext();

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [data, setData] = useState();
  const [cartData, setCartData] = useState([]);
  const [cartCompareData, setCartCompareData] = useState([]);
  const [categoryList, SetCategoryList] = useState([])

  const [globallang, setgloballang] = useState('en');
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [categoryType, setCategoryType] = useState('Products');

  useEffect(() => {
    setOpen(open);
  }, [open]);

  useEffect(() => {
    console.log(categoryType)
    // setCategoryType('products')
    if (router.route === "/") {
      router.replace("/");
    }
    getUserDetail();
    getCategory()
  }, []);

  useEffect(() => {
    if (cartCompareData.length > 0) {
      const d = localStorage.getItem("CompareClose");
      if (d === 'open') {
        setCompareOpen(true)
      }
    } else {
      setCompareOpen(false)
    }
  }, [cartCompareData])

  const getUserDetail = async () => {
    const user = localStorage.getItem("userDetail");
    if (user) {
      setUser(JSON.parse(user));
    }
    let cart = localStorage.getItem("addCartDetail");
    if (cart) {
      setCartData(JSON.parse(cart));
    }
    let cartCompare = localStorage.getItem("addCartCompare");
    if (cartCompare) {
      setCartCompareData(JSON.parse(cartCompare));
    }

    const myip = await getip();
    console.log("myip==============>", myip);

    let country = ['IN', 'FR']

    // if (!country.includes(myip.country)) {
    //   router.replace("/error");
    //   // alert('This web is not available in your country')
    // }

    CountryLanguage.getCountryLanguages(
      myip?.country,
      async function (err, languages) {
        if (err) {
          console.log(err);
        } else {
          console.log("language-------------------------->", languages);
          let l = {}
          if (languages.length > 0) {
            const supportedLngs = ["en", "fr"];
            l = languages.find((f) => supportedLngs.includes(f.iso639_1));
            console.log("l-------------------------->", l);
            if (l?.iso639_1) localStorage.setItem("LANGUAGE", l.iso639_1);
          }
          const iplang = localStorage.getItem("LANGUAGE");
          console.log("iplang", iplang);
          if (iplang) {
            i18n.changeLanguage(iplang);
            setgloballang(iplang)
          } else {
            if (l?.iso639_1) {
              i18n.changeLanguage(l.iso639_1);
              setgloballang(l.iso639_1)
            }

          }
        }
      }
    );

  };

  const getCategory = async (cat) => {
    Api("get", `getCategory?type=${categoryType}`, "", router).then(
      (res) => {
        console.log("res================>", res);
        SetCategoryList(res.data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  return (
    <div>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPALPAYMENT, currency: "EUR" }}>

        <Head>
          <link rel="icon" href="/icons/logo.png" type="image/png" sizes="36x36" />
        </Head>

        <ToastContainer />

        <languageContext.Provider value={[globallang, setgloballang]}>
          <userContext.Provider value={[user, setUser]}>
            <cartContext.Provider value={[cartData, setCartData]}>
              <cartCompareContext.Provider value={[cartCompareData, setCartCompareData]}>
                <categoryContext.Provider value={[categoryType, setCategoryType]}>
                  <categoryListContext.Provider value={[categoryList, SetCategoryList]}>
                    <Layout loader={setOpen} constant={data} toaster={(t) => toast(t.message)}>
                      {open && <Loader open={open} />}
                      {compareOpen &&
                        <div className="bg-custom-gray md:bottom-0 bottom-[57px] fixed w-full z-50 md:p-0 p-2">
                          <div className="mx-auto w-full md:py-5 md:px-10">
                            <div className="md:grid md:grid-cols-8">
                              <div className="relative flex flex-col pb-5 md:hidden">
                                <div className=" absolute top-0 right-0 text-xl text-white"><IoIosCloseCircleOutline onClick={() => { setCompareOpen(false) }} /></div>
                                <div className="md:block flex md:gap-2 w-full items-center">
                                  <button disabled={cartCompareData.length < 2} className={`md:mt-10 mt-2 w-full text-white bg-custom-red rounded-2xl py-1 ${cartCompareData.length < 2 ? ' bg-red-800' : 'bg-custom-red'}`} onClick={() => { router.push('/compare-products'); setCompareOpen(false) }}>{t("Compare")}</button>
                                  <button className="mt-2 text-white  rounded-2xl py-1 w-full" onClick={() => { setCartCompareData([]); localStorage.removeItem('addCartCompare') }}>{t("Clear All")}</button>
                                </div>

                              </div>
                              <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-2 col-span-7 md:order-1 order-2">
                                {cartCompareData?.map((item, i) => (<div key={i} className="flex gap-2 bg-white p-2 relative h-max ">
                                  <div className=" absolute top-0 right-0 text-xl text-black"><IoIosCloseCircleOutline onClick={() => {
                                    let d = cartCompareData;
                                    let c = d.filter(f => f._id !== item?._id)
                                    setCartCompareData([...c])
                                    localStorage.setItem("addCartCompare", JSON.stringify(c));
                                  }} /></div>
                                  <div className="h-16 w-16 flex justify-center items-center overflow-hidden">
                                    <img className="object-cover" src={item?.varients[0]?.image[0]} height={'100%'} width={'100%'} />
                                  </div>
                                  <div>
                                    <p className="text-black text-xs">{item?.name}</p>
                                    <p className="text-black text-xs font-bold">{constant?.currency}{item?.price}</p>
                                  </div>
                                </div>))}
                              </div>
                              <div className="relative md:flex hidden flex-col pl-2  md:order-2 order-1">
                                <div className=" absolute top-0 right-0 text-xl text-white"><IoIosCloseCircleOutline onClick={() => { setCompareOpen(false); localStorage.setItem("CompareClose", 'close'); }} /></div>
                                <div className="md:block flex md:gap-2 w-full items-center">
                                  <button disabled={cartCompareData.length < 2} className={`md:mt-10 mt-2 w-full text-white bg-custom-red rounded-2xl py-1 ${cartCompareData.length < 2 ? ' bg-red-800' : 'bg-custom-red'}`} onClick={() => { router.push('/compare-products'); setCompareOpen(false) }}>{t("Compare")}</button>
                                  <button className="mt-2 text-white  rounded-2xl py-1 w-full" onClick={() => { setCartCompareData([]); localStorage.removeItem('addCartCompare') }}>{t("Clear All")}</button>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      <Component
                        toaster={(t) => toast(t.message)}
                        {...pageProps}
                        loader={setOpen}
                        user={user}
                      />

                    </Layout>
                  </categoryListContext.Provider>
                </categoryContext.Provider>
              </cartCompareContext.Provider>
            </cartContext.Provider>
          </userContext.Provider>
        </languageContext.Provider>
      </PayPalScriptProvider>
    </div>
  )
}

export default appWithI18Next(App, ni18nConfig);
