import { Api } from "@/services/service";
import React, { useState, useEffect, useMemo } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useRouter } from "next/router";
import { RxCrossCircled } from "react-icons/rx";
import { useContext } from "react";
import { cartContext, userContext } from "./_app";
import Swal from "sweetalert2";
import { produce } from "immer";
// import {
//     Elements,
//     useElements,
//     useStripe,
//     ElementProps,
//     PaymentElement,
//     Ele,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import CheckoutForm from '@/components/Checkout/stripe';
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);
import { useTranslation } from "react-i18next";
import constant from "@/services/constant";
import ConfirmationModal from "@/components/ConfirmationModel";
import { IoRemoveSharp } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
// import PayPalCheckout from '@/components/PayPalCheckout';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Select from "react-select";
import countryList from "react-select-country-list";

function Cart(props) {
  const router = useRouter();
  const [cartData, setCartData] = useContext(cartContext);
  const [CartTotal, setCartTotal] = useState(0);
  const [CartItem, setCartItem] = useState(0);
  const [showcart, setShowcart] = useState(false);

  const [shippingAddressData, setShippingAddressData] = useState({
    firstName: "",
    address: "",
    pinCode: "",
    phoneNumber: "",
    city: "",
    country: {},
  });
  const [showPayment, setShowPayment] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [clientSecret, setClientSecret] = useState("");

  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cartClosed, setCartClosed] = useState(false);

  const options = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    let cart = localStorage.getItem("addCartDetail");
    if (cart) {
      setCartData(JSON.parse(cart));
    }
  }, []);

  useEffect(() => {
    if (router.query.clientSecret) {
      setShowPayment(false);
      createProductRquest();
    }
  }, [router]);

  const payPalPayment = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const profile = () => {
    props.loader(true);
    Api("get", "getProfile", "", router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setShippingAddressData({
            firstName: res?.data?.shiping_address?.firstName,
            address: res?.data?.shiping_address?.address,
            pinCode: res?.data?.shiping_address?.pinCode,
            phoneNumber: res?.data?.shiping_address?.phoneNumber,
            city: res?.data?.shiping_address?.city,
            country: res?.data?.shiping_address?.country,
          });
          console.log(res?.data?.shiping_address?.country);
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  useEffect(() => {
    const sumWithInitial = cartData.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue?.total || 0),
      0,
    );
    const sumWithInitial1 = cartData?.reduce(
      (accumulator, currentValue) =>
        accumulator + Number(currentValue?.qty || 0),
      0,
    );
    setCartItem(sumWithInitial1);
    setCartTotal(sumWithInitial);
  }, [cartData]);

  const cartClose = (item, i) => {
    setCartClosed(true);

    // Swal.fire({
    //     title: "Are you sure?",
    //     text: "You want to proceed with the deletion? change this to You want to proceed with the delete?",
    //     icon: "warning",
    //     showCancelButton: true,
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Delete"
    // })
    //     .then(function (result) {
    //         if (result.isConfirmed) {
    //             const nextState = produce(cartData, draftState => {
    //                 if (i !== -1) {
    //                     draftState.splice(i, 1);
    //                 }
    //             })
    //             if (nextState) {
    //                 setCartData(nextState)
    //                 localStorage.setItem("addCartDetail", JSON.stringify(nextState));
    //             } else {
    //                 setCartData([])
    //                 localStorage.removeItem("addCartDetail");
    //             }

    //         } else if (result.isDenied) {
    //             // setFullUserDetail({})
    //         }
    //     });
  };

  const createProductRquest = () => {
    // e.preventDefault();
    // if (cartData?.length === 0) {
    //     props.toaster({ type: "warning", message: 'Your cart is empty' });
    //     return
    // }
    let data = [];
    let cart = localStorage.getItem("addCartDetail");
    let address = localStorage.getItem("shippingAddressData");
    let d = JSON.parse(cart);
    d.forEach((element) => {
      data.push({
        product: element?._id,
        image: element?.selectedColor?.image || element?.image,
        color: element.selectedColor?.color,
        total: element.total,
        price: element.price,
        qty: element.qty,
        seller_id: element.userid,
      });
    });
    let newData = {
      productDetail: data,
      total: CartTotal.toFixed(2),
      shiping_address: shippingAddressData,
      category_type: "Products",
      // JSON.parse(address)
    };

    console.log(data);
    console.log(newData);
    props.loader(true);
    Api("post", "createProductRquest", newData, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res.status) {
          setCartData([]);
          setCartTotal(0);
          localStorage.removeItem("addCartDetail");
          props.toaster({ type: "success", message: res.data?.message });
          router.push("/orders");
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const appearance = {
    theme: "stripe",
    // theme: "default",
    // layout: "tabs",
    // paymentMethodOrder: ["apple_pay", "google_pay", "card"],
  };

  // const options = {
  //     clientSecret,
  //     appearance,
  // };

  const payment = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "shippingAddressData",
      JSON.stringify(shippingAddressData),
    );
    const cur = {
      $: "USD",
      "£": "GBP",
      "€": "EUR",
    };

    const data = {
      price: CartTotal.toFixed(2),
      currency: "EUR",
    };
    console.log(data);
    props.loader(true);
    Api("post", `poststripe`, data, router).then(
      (res) => {
        props.loader(false);
        console.log("Payment called", res);
        setClientSecret(res.clientSecret);
        setShowcart(false);
        setShowPayment(true);
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  return (
    <div className="bg-white w-full max-w-7xl mx-auto">
      {/* <section className="w-full md:h-[333px] h-[80px] flex flex-col justify-center items-center"
                style={{
                    backgroundImage: `url("/cartBackground.png")`,
                    backgroundSize: "cover",
                }}
            >
                <p className='text-black md:text-[50px] text-2xl font-medium'>{t("Cart")}</p>
            </section> */}
      <p className="text-black  text-2xl font-medium md:px-0 mx-auto w-full py-5 px-5"></p>
      <div className="md:mb-8 mb-3">
        <p className="text-sm text-gray-600 md:ps-0 ps-4">
          <span
            className="hover:text-gray-900 cursor-pointer"
            onClick={() => router.push("/")}
          >
            {t("Home")}
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium"> {t("Cart")}</span>
        </p>
      </div>

      {cartData?.length !== 0 && (
        <div className="max-w-7xl mx-auto ">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <div className="hidden md:grid grid-cols-4 bg-gray-50 rounded-xl py-4 mb-4 text-sm font-semibold text-gray-700 shadow-sm">
                <p className="text-center">{t("Product")}</p>
                <p className="text-center">{t("Price")}</p>
                <p className="text-center">{t("Quantity")}</p>
                <p className="text-center">{t("Subtotal")}</p>
              </div>

              {cartData.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-2 items-center bg-white rounded-xl shadow-sm p-4 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item?.varients?.[0]?.image}
                      className="w-20 h-20 object-contain rounded-lg border"
                    />
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item?.name}
                    </p>
                  </div>

                  <p className="text-center text-gray-600 font-medium">
                    {constant?.currency}
                    {item?.price}
                  </p>

                  <div className="flex justify-center">
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button
                        className="px-3 py-1.5 text-black bg-gray-100 hover:bg-gray-200"
                        onClick={() => {
                          if (item.qty > 1) {
                            const nextState = produce(cartData, (draft) => {
                              draft[i].qty -= 1;
                              draft[i].total = (
                                draft[i].price * draft[i].qty
                              ).toFixed(2);
                            });
                            setCartData(nextState);
                            localStorage.setItem(
                              "addCartDetail",
                              JSON.stringify(nextState),
                            );
                          }
                        }}
                      >
                        <IoRemoveSharp />
                      </button>

                      <span className="px-4 text-sm font-medium text-black">
                        {item?.qty}
                      </span>

                      <button
                        className="px-3 py-1.5 bg-gray-100 text-black hover:bg-gray-200"
                        onClick={() => {
                          const nextState = produce(cartData, (draft) => {
                            draft[i].qty += 1;
                            draft[i].total = (
                              draft[i].price * draft[i].qty
                            ).toFixed(2);
                          });
                          setCartData(nextState);
                          localStorage.setItem(
                            "addCartDetail",
                            JSON.stringify(nextState),
                          );
                        }}
                      >
                        <IoAddSharp />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <p className="font-semibold text-gray-800">
                      {constant?.currency}
                      {Number(item.total).toFixed(2)}
                    </p>
                    <AiFillDelete
                      className="text-red-500 cursor-pointer text-xl"
                      onClick={() => cartClose(item, i)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 h-max sticky top-24 space-y-5">
              <div className="border rounded-xl p-4 flex items-start gap-3">
                {/* Icon */}
                <div className="bg-gray-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 005.657-5.657z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>

                {/* Address Content */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">
                    {t("Shipping Address")}
                  </p>

                  {shippingAddressData?.address ? (
                    <div className="text-sm text-gray-600 leading-relaxed">
                      <p className="font-medium text-gray-800">
                        {shippingAddressData.firstName}
                      </p>
                      <p>{shippingAddressData.address}</p>
                      <p>
                        {shippingAddressData.city} –{" "}
                        {shippingAddressData.pinCode}
                      </p>
                      <p>{shippingAddressData.country?.name}</p>
                      <p className="mt-1 text-gray-700">
                        📞 {shippingAddressData.phoneNumber}
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      <p>{t("No address added yet")}</p>
                      {/* <button
                        onClick={() => setShowcart(true)}
                        className="mt-2 text-sm text-custom-red font-medium hover:underline"
                      >
                        + {t("Add Address")}
                      </button> */}
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                {t("Order Summary")}
              </h2>

              <div className="flex justify-between text-gray-700">
                <span>{t("Subtotal")}</span>
                <span>
                  {constant?.currency}
                  {CartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-green-600 font-medium">
                <span>{t("Shipping")}</span>
                <span>{t("Free")}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>{t("Total")}</span>
                <span className="text-custom-red">
                  {constant?.currency}
                  {CartTotal.toFixed(2)}
                </span>
              </div>

              <div className="bg-green-50 text-green-700 text-sm text-center py-2 rounded-lg">
                🚚 {t("Free Shipping on this order")}
              </div>

              <button
                className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                // disabled={!shippingAddressData?.address}
                onClick={() => {
                  if (!user?.email) {
                    props.toaster({
                      type: "success",
                      message: "Login required",
                    });
                    router.push(`/auth/signIn?from=cart`);
                  } else {
                    setShowcart(true);
                    profile();
                  }
                }}
              >
                {t("Proceed to Checkout")}
              </button>
            </div>
          </div>
        </div>
      )}

      {cartData?.length === 0 && (
        <div className="w-full md:h-[500px] h-[200px] flex flex-col justify-center items-center gap-3 text-center">
          <BsCart4 className="text-gray-800 md:w-40 w-28 md:h-40 h-28" />
          <p className="md:text-2xl text-lg font-semibold text-gray-800">
            {t("Your cart is empty")}
          </p>
          <p className="text-sm text-gray-500 max-w-xs">
            {t("Looks like you haven't added anything to your cart yet.")}
          </p>
        </div>
      )}

      {showcart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
            {/* LEFT : ADDRESS FORM */}
            <div className="p-6 md:p-8 border-r">
              <h2 className="text-2xl font-bold text-black mb-1">
                Shipping Address
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Fill the address to proceed with payment
              </p>

              <div className="space-y-4">
                <input
                  className="w-full h-[45px] px-4 rounded-xl border border-gray-300 focus:border-black outline-none"
                  placeholder="First Name"
                  value={shippingAddressData.firstName}
                  onChange={(e) =>
                    setShippingAddressData({
                      ...shippingAddressData,
                      firstName: e.target.value,
                    })
                  }
                />

                <input
                  className="w-full h-[45px] px-4 rounded-xl border border-gray-300 focus:border-black outline-none"
                  placeholder="Address"
                  value={shippingAddressData.address}
                  onChange={(e) =>
                    setShippingAddressData({
                      ...shippingAddressData,
                      address: e.target.value,
                    })
                  }
                />

                {/* <div className="grid grid-cols-2 gap-3"> */}
                <input
                  className="w-full h-[45px] px-4 rounded-xl border border-gray-300 focus:border-black outline-none"
                  placeholder="Pin Code"
                  value={shippingAddressData.pinCode}
                  onChange={(e) =>
                    setShippingAddressData({
                      ...shippingAddressData,
                      pinCode: e.target.value,
                    })
                  }
                />
                <input
                  className="w-full h-[45px] px-4 rounded-xl border border-gray-300 focus:border-black outline-none"
                  placeholder="City"
                  value={shippingAddressData.city}
                  onChange={(e) =>
                    setShippingAddressData({
                      ...shippingAddressData,
                      city: e.target.value,
                    })
                  }
                />
                {/* </div> */}

                <input
                  className="w-full h-[45px] px-4 rounded-xl border border-gray-300 focus:border-black outline-none"
                  placeholder="Phone Number"
                  value={shippingAddressData.phoneNumber}
                  onChange={(e) =>
                    setShippingAddressData({
                      ...shippingAddressData,
                      phoneNumber: e.target.value,
                    })
                  }
                />

                <Select
                  placeholder="Country"
                  options={options}
                  value={shippingAddressData.country}
                  onChange={(val) =>
                    setShippingAddressData({
                      ...shippingAddressData,
                      country: val,
                    })
                  }
                />
              </div>
            </div>

            <div className="p-6 md:p-8 bg-gray-50 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {" "}
                      {constant?.currency}
                      {CartTotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg text-black border-t pt-3 mt-2">
                    <span>Total</span>
                    <span>
                      {" "}
                      {constant?.currency}
                      {CartTotal}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Secure payment powered by PayPal
                </p>
              </div>

              {shippingAddressData && (
                <div className="mt-6">
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              value: CartTotal,
                            },
                          },
                        ],
                        payer: {
                          name: {
                            given_name: shippingAddressData.firstName,
                            surname: shippingAddressData.firstName,
                          },
                          phone: {
                            phone_type: "MOBILE",
                            phone_number: {
                              national_number: shippingAddressData.phoneNumber,
                            },
                          },
                          address: {
                            address_line_1: shippingAddressData.address,
                            admin_area_1: shippingAddressData.city,
                            postal_code: shippingAddressData.pinCode,
                            country_code: shippingAddressData.country?.value,
                          },
                          email_address: user?.email,
                        },
                        application_context: {
                          shipping_preference: "NO_SHIPPING",
                          user_action: "PAY_NOW",
                        },
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(() => {
                        createProductRquest();
                      });
                    }}
                  />
                </div>
              )}
            </div>

            {/* CLOSE */}
            <button
              onClick={() => setShowcart(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <RxCrossCircled className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      <section className="bg-custom-lightGrayColors w-full flex flex-col justify-center items-center my-8">
        <div className="md:px-0 mx-auto w-full  px-5 md:pt-10 pt-5 md:pb-10 pb-5">
          <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">
            <div className="flex justify-start items-start">
              <img className=" h-[50px] w-[50px]" src="/trophyImg.png" />
              <div className="md:pl-[8px] pl-3">
                <p className="text-custom-newBlack  text-xl font-semibold">
                  {t("High Quality")}
                </p>
                <p className="text-custom-newGrayColor text-base font-medium pt-1">
                  {t("crafted from top materials")}
                </p>
              </div>
            </div>

            <div className="flex justify-start items-start">
              <img
                className=" h-[50px] w-[50px]"
                src="/warrantyProtectionImg.png"
              />
              <div className="md:pl-[8px] pl-3">
                <p className="text-custom-newBlack  text-xl font-semibold">
                  {t("Warranty Protection")}
                </p>
                <p className="text-custom-newGrayColor  text-base font-medium pt-1">
                  {t("Over 2 years")}
                </p>
              </div>
            </div>

            <div className="flex justify-start items-start">
              <img className=" h-[50px] w-[50px]" src="/shippingImg.png" />
              <div className="md:pl-[8px] pl-3">
                <p className="text-custom-newBlack  text-xl font-semibold">
                  {t("Free Shipping")}
                </p>
                <p className="text-custom-newGrayColor text-base font-medium pt-1">
                  {t("Order over 150 $")}
                </p>
              </div>
            </div>

            <div className="flex justify-start items-start">
              <img className=" h-[50px] w-[50px]" src="/supportImg.png" />
              <div className="md:pl-[8px] pl-3">
                <p className="text-custom-newBlack text-xl font-semibold">
                  {t("24 / 7 Support")}
                </p>
                <p className="text-custom-newGrayColor text-base font-medium pt-1">
                  {t("Dedicated support")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* {showPayment && <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                <div className="relative w-max h-auto  bg-white rounded-[15px] mx-auto">
                    <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                        onClick={() => { setShowPayment(false) }}
                    >
                        <RxCrossCircled className="h-full w-full font-semibold " />
                    </div>
                    <div>
                        <Elements options={options} stripe={stripePromise} key={clientSecret}>
                            <CheckoutForm
                                price={CartTotal.toFixed(2)}
                                loader={props.loader}
                                clientSecret={clientSecret}
                                // currency={settings.settingsData.currency}
                                currency={constant.currency}
                                url={`cart`}
                            />
                        </Elements>
                    </div>
                </div>
            </div>
            } */}

      <ConfirmationModal
        open={cartClosed}
        onClose={() => {
          setCartClosed(false);
        }}
        onConfirm={() => {
          setCartClosed(false);
          const nextState = produce(cartData, (draftState) => {
            if (selectedIndex !== -1) {
              draftState.splice(selectedIndex, 1);
            }
          });
          if (nextState) {
            setCartData(nextState);
            localStorage.setItem("addCartDetail", JSON.stringify(nextState));
          } else {
            setCartData([]);
            localStorage.removeItem("addCartDetail");
          }
        }}
        title="Are you sure?"
        description="Would you like to proceed with the delete?"
      />
    </div>
  );
}

export default Cart;
