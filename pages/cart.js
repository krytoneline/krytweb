import { Api } from '@/services/service';
import React, { useState, useEffect, useMemo } from 'react'
import { AiFillDelete } from "react-icons/ai";
import { useRouter } from "next/router";
import { RxCrossCircled } from 'react-icons/rx'
import { useContext } from 'react';
import { cartContext, userContext } from './_app';
import Swal from "sweetalert2";
import { produce } from "immer"
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
import constant from '@/services/constant';
import ConfirmationModal from '@/components/ConfirmationModel';
import { IoRemoveSharp } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
// import PayPalCheckout from '@/components/PayPalCheckout';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Select from 'react-select'
import countryList from 'react-select-country-list'

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
    const [clientSecret, setClientSecret] = useState('');

    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [cartClosed, setCartClosed] = useState(false);

    const options = useMemo(() => countryList().getData(), [])
    console.log(options)

    useEffect(() => {
        // setShowPayment(true)
        console.log(showPayment)
        // profile()
    }, []);


    useEffect(() => {
        let cart = localStorage.getItem("addCartDetail");
        if (cart) {
            setCartData(JSON.parse(cart));
        }
    }, []);

    useEffect(() => {
        if (router.query.clientSecret) {
            setShowPayment(false)
            createProductRquest()
        }
    }, [router]);


    const payPalPayment = (e) => {
        e.preventDefault();
        setShowPayment(true)
    }

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
                    console.log(res?.data?.shiping_address?.country)
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
            }
        );
    };

    useEffect(() => {
        const sumWithInitial = cartData.reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue?.total || 0),
            0,
        );
        const sumWithInitial1 = cartData?.reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue?.qty || 0),
            0,
        );
        setCartItem(sumWithInitial1)
        setCartTotal(sumWithInitial)
    }, [cartData])

    const cartClose = (item, i) => {
        setCartClosed(true)

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


    }

    const createProductRquest = () => {
        // e.preventDefault();
        // if (cartData?.length === 0) {
        //     props.toaster({ type: "warning", message: 'Your cart is empty' });
        //     return
        // }
        let data = []
        let cart = localStorage.getItem("addCartDetail");
        let address = localStorage.getItem("shippingAddressData");
        let d = JSON.parse(cart)
        d.forEach(element => {
            data.push({
                product: element?._id,
                image: element?.selectedColor?.image || element?.image,
                color: element.selectedColor?.color,
                total: element.total,
                price: element.price,
                qty: element.qty,
                seller_id: element.userid,
            })
        });
        let newData = {
            productDetail: data,
            total: CartTotal.toFixed(2),
            shiping_address: shippingAddressData,
            category_type: 'Products'
            // JSON.parse(address)
        }

        console.log(data)
        console.log(newData)
        props.loader(true);
        Api("post", 'createProductRquest', newData, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    setCartData([]);
                    setCartTotal(0);
                    localStorage.removeItem("addCartDetail");
                    props.toaster({ type: "success", message: res.data?.message });
                    router.push('/orders')
                }
                else {
                    props.toaster({ type: "error", message: res?.data?.message });
                }

            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

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
        localStorage.setItem("shippingAddressData", JSON.stringify(shippingAddressData));
        const cur = {
            "$": "USD",
            "£": "GBP",
            "€": "EUR"
        }

        const data = {
            price: CartTotal.toFixed(2),
            currency: 'EUR'
        };
        console.log(data);
        props.loader(true);
        Api("post", `poststripe`, data, router).then(
            (res) => {
                props.loader(false);
                console.log("Payment called", res);
                setClientSecret(res.clientSecret);
                setShowcart(false)
                setShowPayment(true)
            },
            (err) => {
                console.log(err);
                props.loader(false);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <div className="bg-white w-full">
            {/* <section className="w-full md:h-[333px] h-[80px] flex flex-col justify-center items-center"
                style={{
                    backgroundImage: `url("/cartBackground.png")`,
                    backgroundSize: "cover",
                }}
            >
                <p className='text-black md:text-[50px] text-2xl font-medium'>{t("Cart")}</p>
            </section> */}
            <p className='text-black  text-2xl font-medium md:px-10 mx-auto w-full py-5 px-5'>{t("Cart")}</p>

            {cartData?.length !== 0 && <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="md:px-10 mx-auto w-full  px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <div className='grid md:grid-cols-4 grid-cols-1 w-full md:gap-5'>
                        <div className='col-span-3 w-full'>
                            <div className='grid grid-cols-4 w-full bg-custom-lightGrayColors h-[58px]'>
                                <div className='flex justify-center items-center'>
                                    <p className='text-black font-medium text-base'>{t("Product")}</p>
                                </div>
                                <div className='flex justify-center items-center'>
                                    <p className='text-black font-medium text-base'>{t("Price")}</p>
                                </div>
                                <div className='flex justify-center items-center'>
                                    <p className='text-black font-medium text-base'>{t("Quantity")}</p>
                                </div>
                                <div className='flex justify-center items-center'>
                                    <p className='text-black font-medium text-base'>{t("Subtotal")}</p>
                                </div>
                            </div>
                            {cartData.map((item, i) => (<div key={i} className='grid grid-cols-4 w-full gap-2 bg-white md:pt-0 pt-5'>
                                <div className='flex md:flex-row flex-col justify-start items-center'>
                                    <img className='md:h-[111px] h-[50px] md:w-[111px] w-[50px] object-contain' src={item?.varients?.[0].image} />
                                    <p className='text-custom-newGray font-normal md:text-base text-xs md:ml-5 md:pt-0 pt-2'>{item?.name}</p>
                                </div>
                                <div className='flex justify-center items-center'>
                                    <p className='text-custom-newGray font-normal md:text-base text-xs md:text-start text-center'>{constant?.currency}{item?.price}</p>
                                </div>
                                <div className='flex justify-center items-center'>
                                    {/* <div className='md:w-[34px] w-[25px] md:h-[34px] h-[25px] border-2 border-custom-newGray rounded-[6px] flex justify-center items-center'>
                                        <p className='text-black font-normal md:text-base text-xs'>{item?.qty}</p>
                                    </div> */}
                                    <div className='border border-custom-newOffWhite max-w-max h-[30px] rounded-[15px]  flex items-center'>
                                        <div className='h-[30px] w-[30px] bg-custom-newLightGrays rounded-[15px] flex justify-center items-center cursor-pointer'
                                            onClick={() => {
                                                if (item.qty > 1) {
                                                    const nextState = produce(cartData, draft => {
                                                        draft[i].qty = draft[i].qty - 1
                                                        draft[i].total = (draft[i]?.price * draft[i].qty).toFixed(2)
                                                    })
                                                    setCartData(nextState)
                                                    localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                                                }
                                            }}>
                                            <IoRemoveSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                                        </div>
                                        <p className='text-custom-newDarkBlack text-base font-normal text-center mx-4'>{item?.qty || 0}</p>
                                        <div className='h-[30px] w-[30px] bg-white border border-custom-newOffWhite rounded-[15px] flex justify-center items-center cursor-pointer'
                                            onClick={() => {
                                                const nextState = produce(cartData, draft => {
                                                    draft[i].qty = draft[i].qty + 1
                                                    draft[i].total = (draft[i]?.price * draft[i].qty).toFixed(2)
                                                })
                                                setCartData(nextState)
                                                localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                                            }}>
                                            <IoAddSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex md:flex-row flex-col justify-center items-center'>
                                    <p className='text-black font-normal md:text-base text-xs md:text-start text-center'>{constant?.currency}{Number(item.total).toFixed(2)}</p>
                                    <AiFillDelete className='w-[23px] h-[23px] text-custom-red md:ml-10 md:pt-0 pt-2' onClick={() => { cartClose(item, i); setSelectedIndex(i) }} />
                                </div>
                            </div>))}
                        </div>

                        <div className='bg-custom-lightGrayColors w-full p-5 flex flex-col justify-start items-center md:mt-0 mt-5'>
                            <p className='text-black md:text-[33px] text-2xl font-semibold text-center'>{t("Cart Totals")}</p>
                            <div className='md:pt-16 pt-5 flex'>
                                <p className='text-black text-base font-medium'>{t("Subtotal")}</p>
                                <p className='text-custom-newGray text-base font-medium ml-10'>{constant?.currency}{CartTotal.toFixed(2)}</p>
                            </div>
                            <div className='md:pt-5 pt-2 flex'>
                                <p className='text-black text-base font-medium'>{t("Total")}</p>
                                <p className='text-custom-red md:text-[21px] text-lg font-medium ml-10'>{constant?.currency}{CartTotal.toFixed(2)}</p>
                            </div>
                            <button className='bg-custom-lightGrayColors border-2 border-black rounded-[16px] md:h-[50px] h-[40px] w-[234px] text-black md:text-[21px] text-base font-normal md:mt-10 mt-5'
                                onClick={() => {

                                    if (cartData?.length === 0) {
                                        props.toaster({ type: "warning", message: 'Your cart is empty' });
                                        return
                                    } else {
                                        if (user?.email) {
                                            setShowcart(true)
                                            profile()
                                        } else {
                                            props.toaster({ type: "success", message: 'Login required' });
                                            router.push(`/auth/signIn?from=cart`);
                                            return
                                        }
                                    }

                                }}
                            >{t("Check Out")}</button>
                            {/* onClick={createProductRquest} */}
                        </div>
                    </div>
                </div>
            </section>}

            {cartData?.length === 0 && <div className='w-full md:h-[500px] h-[200px] flex flex-col justify-center items-center md:pt-0 pt-5 md:pb-0 pb-10'>
                <BsCart4 className='text-black md:w-40 w-32 md:h-40 h-32' />
                <p className="md:text-2xl text-lg text-black font-normal text-center pt-3">{t("Your cart is empty.")}</p>
            </div>}

            {showcart && <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto max-h-screen overflow-auto">
                    <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                        onClick={() => { setShowcart(false); setShowPayment(false) }}
                    >
                        <RxCrossCircled className="h-full w-full font-semibold " />
                    </div>

                    <form className='px-5 py-5' onSubmit={payPalPayment}>
                        {/* onSubmit={createProductRquest} */}
                        {showPayment && <p className='text-black font-bold text-2xl mb-5'>{t("PayPal Payment")}</p>}

                        {!showPayment && <div className='w-full'>
                            <p className='text-black font-bold text-2xl mb-5'>{t("Shipping Address")}</p>

                            <div className='w-full'>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none mb-5" type="text" placeholder={t("First Name")}
                                    required
                                    value={shippingAddressData?.firstName}
                                    onChange={(text) => {
                                        setShippingAddressData({
                                            ...shippingAddressData,
                                            firstName: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none mb-5" type="text" placeholder={t("Address")}
                                    required
                                    value={shippingAddressData?.address}
                                    onChange={(text) => {
                                        setShippingAddressData({
                                            ...shippingAddressData,
                                            address: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none mb-5" type="text" placeholder={t("Pin Code")}
                                    required
                                    value={shippingAddressData?.pinCode}
                                    onChange={(text) => {
                                        setShippingAddressData({
                                            ...shippingAddressData,
                                            pinCode: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none mb-5" type="number" placeholder={t("Phone number")}
                                    required
                                    value={shippingAddressData?.phoneNumber}
                                    onChange={(text) => {
                                        setShippingAddressData({
                                            ...shippingAddressData,
                                            phoneNumber: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none mb-5" type="text" placeholder={t("City")}
                                    required
                                    value={shippingAddressData?.city}
                                    onChange={(text) => {
                                        setShippingAddressData({
                                            ...shippingAddressData,
                                            city: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                {/* <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none mb-5" type="text" placeholder={t("Country")}
                                    required
                                    value={shippingAddressData?.country}
                                    onChange={(text) => {
                                        setShippingAddressData({
                                            ...shippingAddressData,
                                            country: text.target.value,
                                        });
                                    }}
                                /> */}
                                <Select className='md:!min-h-[50px] min-h-[40px] mb-5' placeholder='Country' options={options}
                                    value={shippingAddressData?.country}
                                    required
                                    onChange={(text) => {
                                        console.log(text)
                                        let c = { ...text }
                                        setShippingAddressData({
                                            ...shippingAddressData,
                                            country: text,
                                        });
                                    }} />
                            </div>

                            <div className='flex md:justify-start justify-center'>
                                <button className='bg-custom-gray w-full md:h-[50px] h-[40px] rounded-[5px] text-white font-normal text-base' type="submit">{t("Place Order")}</button>
                            </div>
                        </div>}

                        {showPayment && <PayPalButtons
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [
                                        {
                                            amount: {
                                                value: CartTotal, // Set the transaction amount
                                            },
                                        },
                                    ],
                                    payer: {
                                        name: {
                                            given_name: shippingAddressData?.firstName,
                                            surname: shippingAddressData?.firstName,
                                        },
                                        phone: {
                                            phone_type: "MOBILE",
                                            phone_number: {
                                                national_number: shippingAddressData?.phoneNumber,
                                            },
                                        },
                                        address: {
                                            address_line_1: shippingAddressData?.address,
                                            address_line_2: shippingAddressData?.address,
                                            admin_area_1: shippingAddressData?.city,
                                            admin_area_2: shippingAddressData?.city,
                                            postal_code: shippingAddressData?.pinCode,
                                            country_code: shippingAddressData?.country?.value,
                                        },
                                        email_address: user?.email,
                                    },

                                    application_context: {
                                        shipping_preference: "NO_SHIPPING", // 🚫 No shipping address
                                        user_action: "PAY_NOW", // Button shows "Pay Now" instead of "Continue"
                                    },

                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                    createProductRquest()
                                    // alert(`Transaction completed by ${details.payer.name.given_name}`);
                                });
                            }}
                        />}

                    </form>
                </div>
            </div>}

            <section className='bg-custom-lightGrayColors w-full flex flex-col justify-center items-center'>
                <div className="md:px-10 mx-auto w-full  px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <div className='grid md:grid-cols-4 grid-cols-1 w-full gap-5'>

                        <div className='flex justify-start items-start'>
                            <img className='md:h-[64px] h-[50px] md:w-[64px] w-[50px]' src='/trophyImg.png' />
                            <div className='md:pl-[8px] pl-3'>
                                <p className='text-custom-newBlack md:text-2xl text-xl font-semibold'>{t("High Quality")}</p>
                                <p className='text-custom-newGrayColor md:text-xl text-base font-medium pt-1'>{t("crafted from top materials")}</p>
                            </div>
                        </div>

                        <div className='flex justify-start items-start'>
                            <img className='md:h-[64px] h-[50px] md:w-[64px] w-[50px]' src='/warrantyProtectionImg.png' />
                            <div className='md:pl-[8px] pl-3'>
                                <p className='text-custom-newBlack md:text-2xl text-xl font-semibold'>{t("Warranty Protection")}</p>
                                <p className='text-custom-newGrayColor md:text-xl text-base font-medium pt-1'>{t("Over 2 years")}</p>
                            </div>
                        </div>

                        <div className='flex justify-start items-start'>
                            <img className='md:h-[64px] h-[50px] md:w-[64px] w-[50px]' src='/shippingImg.png' />
                            <div className='md:pl-[8px] pl-3'>
                                <p className='text-custom-newBlack md:text-2xl text-xl font-semibold'>{t("Free Shipping")}</p>
                                <p className='text-custom-newGrayColor md:text-xl text-base font-medium pt-1'>{t("Order over 150 $")}</p>
                            </div>
                        </div>

                        <div className='flex justify-start items-start'>
                            <img className='md:h-[64px] h-[50px] md:w-[64px] w-[50px]' src='/supportImg.png' />
                            <div className='md:pl-[8px] pl-3'>
                                <p className='text-custom-newBlack md:text-2xl text-xl font-semibold'>{t("24 / 7 Support")}</p>
                                <p className='text-custom-newGrayColor md:text-xl text-base font-medium pt-1'>{t("Dedicated support")}</p>
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

            <ConfirmationModal open={cartClosed} onClose={() => { setCartClosed(false) }} onConfirm={() => {
                setCartClosed(false)
                const nextState = produce(cartData, draftState => {
                    if (selectedIndex !== -1) {
                        draftState.splice(selectedIndex, 1);
                    }
                })
                if (nextState) {
                    setCartData(nextState)
                    localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                } else {
                    setCartData([])
                    localStorage.removeItem("addCartDetail");
                }
            }}
                title='Are you sure?'
                description='Would you like to proceed with the delete?'
            />
        </div>
    )
}

export default Cart
