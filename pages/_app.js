import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader";
import Head from "next/head";
import { IoIosCloseCircleOutline } from "react-icons/io";

import getip from "@/services/myip";
import CountryLanguage from "@ladjs/country-language";
import { appWithI18Next } from "ni18n";
import { ni18nConfig } from "../ni18n.config";
export const languageContext = createContext();
import { useTranslation } from "react-i18next";
import constant from "@/services/constant";
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
  const [categoryList, SetCategoryList] = useState([]);

  const [globallang, setgloballang] = useState("en");
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [categoryType, setCategoryType] = useState("Products");

  useEffect(() => {
    setOpen(open);
  }, [open]);

  useEffect(() => {
    console.log(categoryType);
    // setCategoryType('products')
    if (router.route === "/") {
      router.replace("/");
    }
    getUserDetail();
    getCategory();
  }, []);

  useEffect(() => {
    if (cartCompareData.length > 0) {
      const d = localStorage.getItem("CompareClose");
      if (d === "open") {
        setCompareOpen(true);
      }
    } else {
      setCompareOpen(false);
    }
  }, [cartCompareData]);

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

    let country = ["IN", "FR"];

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
          let l = {};
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
            setgloballang(iplang);
          } else {
            if (l?.iso639_1) {
              i18n.changeLanguage(l.iso639_1);
              setgloballang(l.iso639_1);
            }
          }
        }
      },
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
      },
    );
  };

  return (
    <div>
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPALPAYMENT,
          currency: "EUR",
        }}
      >
        <Head>
          <link
            rel="icon"
            href="/icons/logo.png"
            type="image/png"
            sizes="36x36"
          />
        </Head>

        <ToastContainer />

        <languageContext.Provider value={[globallang, setgloballang]}>
          <userContext.Provider value={[user, setUser]}>
            <cartContext.Provider value={[cartData, setCartData]}>
              <cartCompareContext.Provider
                value={[cartCompareData, setCartCompareData]}
              >
                <categoryContext.Provider
                  value={[categoryType, setCategoryType]}
                >
                  <categoryListContext.Provider
                    value={[categoryList, SetCategoryList]}
                  >
                    <Layout
                      loader={setOpen}
                      constant={data}
                      toaster={(t) => toast(t.message)}
                    >
                      {open && <Loader open={open} />}
                      {compareOpen && (
                        <div className="fixed bottom-0 w-full z-50 bg-[#F2F2F2] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
                          <div className="max-w-7xl mx-auto px-3 py-3 md:py-6">
                            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
                              {/* Products */}
                              <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {cartCompareData.map((item, i) => (
                                  <div
                                    key={i}
                                    className="relative bg-white rounded-xl p-2 flex gap-2 shadow-sm"
                                  >
                                    <IoIosCloseCircleOutline
                                      className="absolute -top-2 -right-2 text-xl text-gray-600 cursor-pointer"
                                      onClick={() => {
                                        const updated = cartCompareData.filter(
                                          (f) => f._id !== item._id,
                                        );
                                        setCartCompareData(updated);
                                        localStorage.setItem(
                                          "addCartCompare",
                                          JSON.stringify(updated),
                                        );
                                      }}
                                    />

                                    <img
                                      src={item?.varients[0]?.image[0]}
                                      className="w-20 h-20 object-contain rounded"
                                    />

                                    <div>
                                      <p className="text-xs text-gray-700 line-clamp-2">
                                        {item?.name}
                                      </p>
                                      <p className="text-sm font-semibold text-black">
                                        {constant?.currency}
                                        {item?.price}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="md:col-span-2 flex flex-col gap-2">
                                <button
                                  disabled={cartCompareData.length < 2}
                                  className={`w-full py-2 rounded-xl text-sm font-semibold text-white transition ${cartCompareData.length < 2 ? "bg-red-400 cursor-not-allowed" : "bg-custom-red hover:bg-red-700"}`}
                                  onClick={() => {
                                    router.push("/compare-products");
                                    setCompareOpen(false);
                                  }}
                                >
                                  Compare
                                </button>

                                <button
                                  className="w-full py-2 rounded-xl text-sm font-semibold border border-gray-400 text-gray-700 hover:bg-gray-200"
                                  onClick={() => {
                                    setCartCompareData([]);
                                    localStorage.removeItem("addCartCompare");
                                  }}
                                >
                                  Clear All
                                </button>
                              </div>

                              {/* Close */}
                              <IoIosCloseCircleOutline
                                className="absolute top-2 right-2 text-2xl text-gray-600 cursor-pointer"
                                onClick={() => {
                                  setCompareOpen(false);
                                  localStorage.setItem("CompareClose", "close");
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
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
  );
}

export default appWithI18Next(App, ni18nConfig);
