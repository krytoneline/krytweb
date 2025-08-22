import React, { useContext, useEffect, useState, useMemo } from 'react'
import { IoIosStar } from "react-icons/io";
import { TbCar } from "react-icons/tb";
import { GrFormNext } from "react-icons/gr";
import { IoRemoveSharp } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import { cartContext, userContext } from '../_app';
import ProductCard from '@/components/ProductCard';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { RxCrossCircled } from 'react-icons/rx'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import moment from 'moment';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
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
import { produce } from 'immer';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Select from 'react-select'
import countryList from 'react-select-country-list'

function ProductDetail(props) {
    const router = useRouter();
    // console.log(router)
    const [productsId, setProductsId] = useState({});
    const [cartData, setCartData] = useContext(cartContext);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedImageList, setSelectedImageList] = useState([]);
    const [productList, SetProductList] = useState([])
    const [showcart, setShowcart] = useState(false);
    const [shippingAddressData, setShippingAddressData] = useState({
        firstName: "",
        address: "",
        pinCode: "",
        phoneNumber: "",
        city: "",
        country: {},
    });
    const [user, setUser] = useContext(userContext);
    const [favourite, setFavourite] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [reviews, setReviews] = useState('product');
    const [productReviews, setProductReviews] = useState([]);

    const [showPayment, setShowPayment] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    const { t } = useTranslation();
    const [selectedName, setSelectedName] = useState({});
    const [showDate, setShowDate] = useState(false);
    const [dateObj, setDateObj] = useState({
        start_date: moment(new Date()).format().slice(0, 16),
        end_date: "",
    });

    const options = useMemo(() => countryList().getData(), [])

    useEffect(() => {
        if (router?.query?.id) {
            getProductById()
        }
    }, [router?.query?.id])

    useEffect(() => {
        if (user?.token) {
            // profile()
        }
    }, [user?.token]);

    // useEffect(() => {
    //     if (router.query.clientSecret) {
    //         setShowPayment(false)
    //         createProductRquest()
    //     }
    // }, [router]);

    const payPalPayment = (e) => {
        e.preventDefault();
        setShowPayment(true)
    }

    const getProductById = async () => {
        let url = `getProductByslug/${router?.query?.id}`
        if (user?.token) {
            url = `getProductByslug/${router?.query?.id}?user=${user?._id}`
        }
        props.loader(true);
        Api("get", url, '', router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                res.data.qty = 1;
                res.data.total = (res.data?.price * res.data.qty).toFixed(2)
                if (res.data.categoryName === 'Hotel and Loadging') {
                    res.data.rooms = 1;
                }
                setProductsId(res.data);
                console.log(res?.data?.minQuantity)

                res.data?.varients[0].selected.forEach(ele => {
                    ele.request = 0
                })
                setSelectedName(res.data.attributes[0])
                setSelectedColor(res.data?.varients[0])
                setSelectedImageList(res.data?.varients[0].image)
                setSelectedImage(res.data?.varients[0].image[0])
                getproductByCategory(res.data.category?.slug, res.data._id)
                setProductReviews(res.data?.reviews)
                if (router.query.clientSecret) {
                    setShowPayment(false)
                    createProductRquest()
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const getproductByCategory = async (category_id, product_id) => {
        props.loader(true);
        Api("get", `getProductBycategoryId?category=${category_id}&product_id=${product_id}`, "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                const sameItem = res.data.filter(f => f._id !== router?.query?.id)
                SetProductList(sameItem)
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const createProductRquest = () => {
        // e.preventDefault();
        // e.preventDefault();
        // return
        // if (cartData?.length === 0) {
        //     props.toaster({ type: "warning", message: 'Your cart is empty' });
        //     return
        // }
        let d1 = localStorage.getItem("productDetalis");

        let address = localStorage.getItem("shippingAddressData");
        let d = productsId
        // JSON.parse(d1)
        let data = {
            product: d?._id,
            // image: element.selectedColor?.image,
            image: selectedImage,
            color: d?.selectedColor?.color,
            total: d?.price * d?.qty,
            price: d?.price,
            qty: d?.qty,
            seller_id: d?.userid,
        }

        // cartData.forEach(element => {
        //     data.push({
        //         product: element?._id,
        //         image: element.selectedColor?.image,
        //         color: element.selectedColor?.color,
        //         total: element.total,
        //         price: element.price,
        //         qty: element.qty,
        //         seller_id: element.userid,
        //     })
        // });
        let newData = {
            productDetail: [data],
            total: d?.price * d?.qty,
            shiping_address: shippingAddressData,
            category_type: productsId.category_type
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
                    // setCartData([]);
                    // setCartTotal(0);
                    // localStorage.removeItem("addCartDetail");
                    props.toaster({ type: "success", message: res.data?.message });
                    router.replace('/orders')
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

    const addremovefavourite = () => {
        if (!user?.token) {
            props.toaster({ type: "success", message: 'Login required' });
            return
        }
        let data = {
            product: productsId?._id,
        }

        console.log(data)
        props.loader(true);
        Api("post", 'addremovefavourite ', data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    props.toaster({ type: "success", message: res.data?.message });
                    getProductById()
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
        productsId.selectedColor = selectedColor;
        productsId.selectedImage = selectedImage;
        localStorage.setItem("shippingAddressData", JSON.stringify(shippingAddressData));
        localStorage.setItem("productDetalis", JSON.stringify(productsId));
        const cur = {
            "$": "USD",
            "£": "GBP",
            "€": "EUR"
        }

        const data = {
            price: productsId.price * productsId.qty.toFixed(2),
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

    const createInquiry = () => {
        // e.preventDefault();
        // let d1 = localStorage.getItem("productDetalis");

        let address = localStorage.getItem("shippingAddressData");
        // let d = JSON.parse(d1)
        let data = {
            product: productsId?._id,
            image: selectedImage,
            days: selectedName?.name,
            start_date: dateObj.start_date,
            total: selectedName?.value,
            // productsId?.total || 
            price: selectedName?.value,
            qty: 1,
            seller_id: productsId?.userid,
        }

        if (selectedName?.name === 'Long-Term') {
            data.end_date = dateObj.end_date
        }

        let newData = {
            productDetail: [data],
            total: selectedName?.value,
            // productsId?.total || 
            category_type: productsId.category_type
            // shiping_address: JSON.parse(address)
        }
        if (productsId.rooms) {
            newData.rooms = productsId.rooms
        }

        console.log(data)
        console.log(newData)
        props.loader(true);
        Api("post", 'createProductRquest', newData, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    setShowDate(false);
                    props.toaster({ type: "success", message: res.data?.message });
                    router.replace('/orders')
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

    // console.log(productsId)

    const responsived = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div className="bg-white w-full z-40">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="mx-auto w-full md:px-10 px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <div className='grid md:grid-cols-3 grid-cols-1 w-full md:gap-5'>
                        <div className='w-full col-span-2'>
                            <p className='text-custom-newBlacks md:text-lg text-base font-semibold'>{productsId?.name}</p>
                            {productsId?.reviews?.length === 0 && <p className='text-custom-newBlackColor font-normal text-sm pt-5'>{t("No reviews yet")}</p>}
                            {productsId?.reviews?.length > 0 && <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
                                <Rating
                                    name="text-feedback"
                                    value={productsId?.rating}
                                    readOnly
                                    precision={0.5}
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <Box sx={{ ml: 2 }}>{productsId?.rating}</Box>
                            </Box>}

                            <div className='grid md:grid-cols-12 grid-cols-1 w-full gap-5 mt-5'>
                                <div className='w-full md:h-[500px] flex md:flex-col flex-row overflow-y-auto overflow-x-hidden'>
                                    {selectedImageList?.map((item, i) => (<div className='w-full'>
                                        <img className={`md:!w-[60px] w-[60px] md:h-[60px] h-[60px] object-contain md:mb-5 p-2 rounded-[10px] ${selectedImage === item ? 'border border-black' : ''}`} src={item}
                                            onClick={() => {
                                                setSelectedImage(item)
                                            }} />
                                    </div>))}
                                </div>
                                <div className='w-full col-span-11 bg-custom-newLightGrayColors rounded-[20px]'>
                                    <img className='w-full md:h-[500px] object-contain' src={selectedImage} />
                                </div>
                            </div>

                            {productsId.category_type === 'Products' && <div>
                                <p className='text-custom-newBlacks text-sm	font-semibold md:pt-10 pt-5'>{t("Long Description")}</p>
                                <p className='text-custom-newBlacks text-sm	font-normal md:pt-5 pt-3'>{productsId?.long_description}</p>
                            </div>}

                            {productList?.length > 0 &&
                                <>
                                    <div className='bg-white w-full md:mt-10 mt-5 md:block hidden'>
                                        <p className='text-custom-newDarkBlack md:text-xl text-xl font-bold text-start md:pb-10 pb-5'>{t("Other recommendations for your business")}</p>
                                        <div className='grid md:grid-cols-3 grid-cols-1 w-full gap-5'>
                                            {productList.slice(0, 4).map((item, i) => (
                                                <div key={i} className='w-full'>
                                                    <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='bg-white w-full md:mt-10 mt-5 md:hidden'>
                                        <p className='text-custom-newDarkBlack md:text-xl text-xl font-bold text-start md:pb-10 pb-5'>{t("Other recommendations for your business")}</p>
                                        <div className='grid md:grid-cols-3 grid-cols-1 w-full gap-5'>
                                            <Carousel className="z-40"
                                                responsive={responsived}
                                                // autoPlay={true}
                                                infinite={true}
                                            >
                                                {productList.slice(0, 4).map((item, i) => (
                                                    <div key={i} className='w-full'>
                                                        <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}`} />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </div>
                                </>
                            }


                            {!productsId?.categoryName && <div className='pt-5 border-b border-b-custom-newOffWhite pb-5'>
                                <p className='text-custom-newBlacks text-xl font-bold'>{t("Key attributes")}</p>

                                <div className='pt-5'>
                                    {productsId?.attributes?.map((item, i) => (<div key={i} className='w-full border border-custom-newOffWhite  grid md:grid-cols-2 grid-cols-1'>
                                        <div className='bg-custom-offWhiteColor flex justify-start items-center md:px-5 px-3 border-r border-r-custom-newOffWhite'>
                                            <p className='text-custom-newBlacks font-normal md:text-base text-xs'>{item?.name}</p>
                                        </div>
                                        <div className='bg-white flex justify-start items-center md:px-5 px-3 py-1'>
                                            <p className='text-custom-newBlacks font-medium md:text-base text-xs'>{item?.value}</p>
                                        </div>
                                    </div>))}
                                </div>
                            </div>}

                            <div className='pt-5'>
                                <p className='text-custom-newBlacks text-xl	font-bold'>{t("Ratings & Reviews")}</p>

                                <div className='w-full'>
                                    <div className='flex justify-start items-center gap-5 py-5'>
                                        <p className={`text-custom-newBlacks font-normal text-base cursor-pointer ${reviews === 'product' ? 'underline underline-offset-8' : ''}`} onClick={() => { setReviews('product'); setProductReviews(productsId?.reviews) }}>{t("Product reviews")}</p>
                                        <p className={`text-custom-newBlacks font-normal text-base cursor-pointer ${reviews === 'product' ? '' : 'underline underline-offset-8'}`} onClick={() => { setReviews('seller'); setProductReviews(productsId?.sellerreviews) }}>{t("Seller reviews")}</p>
                                    </div>
                                    <p className='text-custom-blackColor font-bold	md:text-2xl text-base'>{reviews === 'product' ? productsId?.rating : productsId?.seller}  <sapn className='text-custom-blackColor font-normal md:text-base  text-xs'>/5</sapn></p>

                                    {productReviews?.map((item, i) => (
                                        <div key={i} className='w-full'>
                                            <div className='pt-5 flex justify-start items-center'>
                                                <div className='w-[40px] h-[40px] bg-custom-newBlue rounded-full flex justify-center items-center'>
                                                    <p className='text-white text-xl font-bold'>{item?.posted_by?.username?.charAt(0).toUpperCase()}</p>
                                                </div>
                                                <div className='ml-5'>
                                                    <div className='flex'>
                                                        <p className='text-custom-newBlacks font-normal text-xs'>{item?.posted_by?.username}</p>
                                                    </div>
                                                    <p className='text-custom-grayColor font-normal text-xs'>{moment(item?.createdAt).format("MMM DD, YYYY")}</p>
                                                </div>
                                            </div>

                                            <p className='text-custom-blackColor font-normal text-base	pt-5'>{item?.description}</p>
                                            <div className='pt-5 flex gap-2'>
                                                <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
                                                    <Rating
                                                        name="text-feedback"
                                                        value={item?.rating}
                                                        readOnly
                                                        precision={0.5}
                                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                    />
                                                    <Box className='text-black' sx={{ ml: 2 }}>{item?.rating}</Box>
                                                </Box>
                                            </div>
                                        </div>))}
                                </div>
                            </div>

                        </div>

                        {productsId.category_type === 'Products' && <div className='bg-white rounded-[8px] pt-5 md:pb-5 md:px-5 md:h-[650px]'>
                            <div className='flex justify-between items-center md:pb-5 pb-3 border-b border-b-custom-newOffWhite'>
                                <div>
                                    <p className='text-custom-blackColor md:text-xl text-base font-bold'>{constant?.currency}{productsId?.price}</p>
                                </div>
                                <div className='w-[46px] h-[46px] bg-custom-grayColorNew rounded-full flex justify-center items-center' onClick={addremovefavourite}>
                                    {!productsId?.favourite && <FaRegHeart className='text-black w-[23px] h-[23px]' />}
                                    {productsId?.favourite && <FaHeart className='text-red-700 w-[23px] h-[23px]' />}
                                </div>
                            </div>
                            <div className='md:pt-5 pt-3 md:pb-5 pb-3 border-b border-b-custom-newOffWhite'>
                                <p className='text-custom-newBlacks font-semibold text-lg'>{t("Quantity")}</p>
                                <div className='border border-custom-newOffWhite max-w-max h-[30px] rounded-[15px] md:mt-5 mt-3 flex items-center'>
                                    <div className='h-[30px] w-[30px] bg-custom-newLightGrays rounded-[15px] flex justify-center items-center cursor-pointer'
                                        onClick={() => {
                                            if (productsId.qty > 1) {
                                                productsId.qty = productsId.qty - 1;
                                                productsId.total = (productsId?.price * productsId.qty).toFixed(2)
                                                setProductsId({ ...productsId })
                                            }
                                        }}>
                                        <IoRemoveSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                                    </div>
                                    <p className='text-custom-newDarkBlack text-base font-normal text-center mx-4'>{productsId?.qty || 0}</p>
                                    <div className='h-[30px] w-[30px] bg-white border border-custom-newOffWhite rounded-[15px] flex justify-center items-center cursor-pointer'
                                        onClick={() => {
                                            productsId.qty = productsId.qty + 1;
                                            productsId.total = (productsId?.price * productsId.qty).toFixed(2)
                                            setProductsId({ ...productsId })
                                        }}>
                                        <IoAddSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                                    </div>
                                </div>
                            </div>

                            {productsId.attributes?.some(
                                (attribute) => attribute.name === "color"
                            ) && <div className='border-b border-[#00000010] w-full md:pb-5 pb-3'>
                                    <p className='text-custom-newBlacks font-semibold text-lg md:pt-5 pt-3 pb-3'>{t("Select Colors")}</p>
                                    <div className='flex gap-2 flex-wrap'>
                                        {productsId?.varients?.map((item, i) => (
                                            <div key={i} className='md:w-[37px] w-[19px] md:h-[37px] h-[19px] rounded-full flex justify-center items-center border border-black' style={{ background: item?.color }} onClick={() => {
                                                item.selected.forEach(ele => {
                                                    ele.request = 0
                                                })
                                                setSelectedColor(item)
                                                setSelectedImageList(item?.image)
                                                setSelectedImage(item?.image[0])
                                            }}>
                                                {selectedColor?.color === item?.color && <FaCheck className='md:w-[18px] w-[11px] md:h-[15px] h-[8px] text-white' />}
                                            </div>
                                        ))}
                                    </div>
                                </div>}

                            {showcart && <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                                <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto max-h-screen overflow-auto">
                                    <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                        onClick={() => { setShowcart(false); setShowPayment(false) }}
                                    >
                                        <RxCrossCircled className="h-full w-full font-semibold " />
                                    </div>

                                    <form className='px-5 py-5' onSubmit={payPalPayment}>

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
                                                                value: productsId.total, // Set the transaction amount
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

                            <div className='pt-5'>
                                <div className='flex justify-between items-center'>
                                    <p className='text-custom-newBlacks md:text-base text-sm font-normal'>{t("Item subtotal")}</p>
                                    <p className='text-custom-newBlacks text-sm font-normal'>{constant?.currency}{productsId.total}</p>
                                </div>
                                <div className='flex justify-between items-center pt-2'>
                                    <p className='text-custom-newBlacks md:text-base text-sm font-normal'>{t("Shipping total")}</p>
                                    <p className='text-custom-newBlacks text-sm font-normal'>{t("Free Shipping")}</p>
                                </div>
                                <div className='flex justify-between items-center pt-2'>
                                    <p className='text-custom-newBlacks md:text-base text-sm font-semibold'>{t("Subtotal")}</p>
                                    <p className='text-custom-newBlacks text-sm font-semibold'>{constant?.currency}{productsId.total}</p>
                                </div>
                            </div>

                            <div className='flex gap-5 mt-5'>
                                {user?.token && <button className='bg-custom-newDarkBlack w-full md:h-[50px] h-[40px] rounded-[24px] text-white font-semibold text-sm'
                                    onClick={() => {
                                        // if (cartData?.length === 0) {
                                        //     props.toaster({ type: "warning", message: 'Your cart is empty' });
                                        //     return
                                        // } else {
                                        if (user?.email) {
                                            setShowcart(true)
                                            profile()
                                        } else {
                                            props.toaster({ type: "success", message: 'Login required' });
                                            router.push(`/auth/signIn?from=cart`);
                                            return
                                        }
                                        // }
                                    }}>{t("Start order")}</button>}
                                <button className='border border-custom-newDarkBlack w-full md:h-[50px] h-[40px] rounded-[24px] text-custom-blackColor font-semibold text-sm'
                                    onClick={() => {
                                        const d = cartData?.length > 0 ? cartData : []
                                        const c = d.find(f => f._id === productsId?._id && f?.selectedColor?.color === selectedColor?.color)
                                        if (!c) {
                                            // console.log(d)
                                            // if (selectedColor) {
                                            //     productsId.selectedColor = selectedColor
                                            // }
                                            // productsId.total = productsId.price
                                            // productsId.image = selectedImage
                                            // d.push(productsId)

                                            let newD = {
                                                ...productsId,
                                                qty: 1,
                                                total: productsId.price,
                                                image: selectedImage
                                            }
                                            if (selectedColor) {
                                                newD.selectedColor = selectedColor
                                            }
                                            const nextState = produce(cartData, draft => {
                                                draft.push(newD)
                                            })
                                            setCartData(nextState)
                                            localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                                        } else {

                                            const nextState = produce(cartData, draft => {
                                                let index = draft.find(f => f._id === productsId._id)
                                                index.qty = index.qty + productsId.qty
                                            })
                                            setCartData(nextState)
                                            localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                                        }

                                        props.toaster({ type: "success", message: `${productsId.qty} item(s) added to the cart` });
                                        productsId.qty = 1
                                        setProductsId({ ...productsId })
                                        // router.push('/cart')
                                    }}>{t("Add to cart")}</button>
                            </div>

                            <p className='text-custom-newBlacks text-sm	font-semibold md:pt-5 pt-3'>{t("Short Description")}</p>
                            <p className='text-custom-newBlacks text-sm	font-normal md:pt-5 pt-3'>{productsId?.short_description}</p>

                        </div>}

                        {productsId.category_type === 'Business' && <div className='bg-white rounded-[8px] boxShadow p-5 md:mt-0 mt-5'>
                            <div className='flex justify-between items-center md:pb-5 pb-3 border-b border-b-custom-newOffWhite'>
                                {productsId.category_type === 'Products' && <div>
                                    <p className='text-custom-blackColor md:text-xl text-base font-bold'>{constant?.currency}{productsId?.price}</p>
                                </div>}

                                {productsId.category_type === 'Business' && <div>
                                    <p className='text-custom-blackColor md:text-xl text-base font-bold'>{selectedName.name}</p>

                                    <p className='text-custom-blackColor md:text-xl text-base font-bold'>{constant?.currency}{selectedName.value}</p>
                                </div>}
                                <div className='w-[46px] h-[46px] bg-custom-grayColorNew rounded-full flex justify-center items-center' onClick={addremovefavourite}>
                                    {!productsId?.favourite && <FaRegHeart className='text-black w-[23px] h-[23px]' />}
                                    {productsId?.favourite && <FaHeart className='text-red-700 w-[23px] h-[23px]' />}
                                </div>
                            </div>
                            <div className='md:pt-5 pt-3 '>
                                <p className='text-custom-newBlacks text-sm	font-semibold'>{t("Select Duration")}</p>
                                <div className='md:pt-5 pt-3 flex justify-start items-center md:gap-5 gap-2'>
                                    {productsId?.attributes?.map((item, i) => (<button key={i} className={`w-[111px] md:h-[48px] h-[40px] rounded-[24px]  md:text-sm text-[10px] font-semibold text-center ${selectedName?.name === item?.name ? 'bg-black border border-custom-newBlacks  text-white' : 'bg-white border border-custom-newBlacks  text-custom-blackColor'}`}
                                        onClick={() => { setSelectedName(item); }}
                                    >{item?.name}</button>))}
                                </div>
                                <button className='bg-black w-[182px] md:h-[48px] h-[40px] rounded-[24px] text-white text-sm font-semibold text-center md:mt-5 mt-3'
                                    onClick={() => {
                                        if (!selectedName?.name) {
                                            props.toaster({ type: "success", message: 'Selected name is required' });
                                            return
                                        } else {
                                            setShowDate(true);
                                        }
                                    }}
                                >{t("Send inquiry")}</button>
                                <p className='text-custom-newBlacks text-sm	font-semibold md:pt-5 pt-3'>{t("Short Description")}</p>
                                <p className='text-custom-newBlacks text-sm	font-normal md:pt-5 pt-3'>{productsId?.short_description}</p>
                                <p className='text-custom-newBlacks text-sm	font-semibold md:pt-5 pt-3'>{t("Long Description")}</p>
                                <p className='text-custom-newBlacks text-sm	font-normal md:pt-5 pt-3'>{productsId?.long_description}</p>
                            </div>
                        </div>}

                        {showDate && <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                            <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
                                <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                    onClick={() => { setShowDate(false) }}>
                                    <RxCrossCircled className="h-full w-full font-semibold " />
                                </div>

                                <div className='px-5 py-5' >
                                    <p className='text-black font-bold text-2xl mb-5'>{t("Date Range")}</p>

                                    <div className='w-full'>
                                        <p className='text-black font-normal text-base pb-2'>{t("Start Date")}</p>
                                        <input className='outline-none border-2 border-black md:p-2 p-1 rounded text-black w-full' type='datetime-local'
                                            value={dateObj.start_date} onChange={(text) => {
                                                console.log(text)
                                                setDateObj({ ...dateObj, start_date: text.target.value });
                                                console.log(moment(new Date()).format().slice(0, 16))
                                            }}
                                            min={moment(new Date()).format().slice(0, 16)}
                                        />
                                    </div>
                                    {selectedName?.name !== 'Half-Day' && selectedName?.name !== 'Full-Day' && <div className='w-full  mt-5'>
                                        <p className='text-black font-normal text-base pb-2'>{t("End Date")}</p>
                                        <input className='outline-none border-2 border-black md:p-2 p-1 rounded text-black w-full' type='datetime-local'
                                            value={dateObj.end_date} onChange={(text) => {
                                                console.log(text.target.value)
                                                setDateObj({ ...dateObj, end_date: text.target.value });
                                            }}
                                            min={dateObj.start_date}
                                        />
                                    </div>}

                                    {selectedName?.name === 'Long-Term' && productsId?.category?.name !== 'Car Rental' && <div className='md:pt-5 pt-3'>
                                        <p className='text-custom-newBlacks font-semibold text-lg'>{t("How many rooms?")}</p>
                                        <div className='border border-custom-newOffWhite max-w-max h-[30px] rounded-[15px] md:mt-5 mt-3 flex items-center'>
                                            <div className='h-[30px] w-[30px] bg-custom-newLightGrays rounded-[15px] flex justify-center items-center cursor-pointer'
                                                onClick={() => {
                                                    if (productsId.rooms > 1) {
                                                        productsId.rooms = productsId.rooms - 1;
                                                        productsId.total = (selectedName?.value * productsId.rooms).toFixed(2)
                                                        setProductsId({ ...productsId })
                                                    }
                                                }}>
                                                <IoRemoveSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                                            </div>
                                            <p className='text-custom-newDarkBlack text-base font-normal text-center mx-4'>{productsId?.rooms || 0}</p>
                                            <div className='h-[30px] w-[30px] bg-white border border-custom-newOffWhite rounded-[15px] flex justify-center items-center cursor-pointer'
                                                onClick={() => {
                                                    console.log(productsId.rooms = productsId.rooms + 1)
                                                    productsId.rooms = productsId.rooms + 1;
                                                    productsId.total = (selectedName?.value * productsId.rooms).toFixed(2)
                                                    setProductsId({ ...productsId })
                                                }}>
                                                <IoAddSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                                            </div>
                                        </div>
                                    </div>}

                                    <div className='flex md:justify-start justify-center mt-5'>
                                        <button className='bg-custom-gray w-full md:h-[50px] h-[40px] rounded-[5px] text-white font-normal text-base' onClick={() => { createInquiry() }}>{t("Send inquiry")}</button>
                                    </div>

                                </div>
                            </div>
                        </div>}

                    </div>
                </div>
            </section >



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
                                price={productsId.price * productsId.qty.toFixed(2)}
                                loader={props.loader}
                                clientSecret={clientSecret}
                                currency={constant.currency}
                                url={`product-detail/${router?.query?.id}`}
                            />
                        </Elements>
                    </div>
                </div>
            </div>} */}

        </div >
    )
}

export default ProductDetail