import { Api, ApiGetPdf } from '@/services/service';
import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from "next/router";
import { RxCrossCircled } from 'react-icons/rx'
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from "react-i18next";
import constant from '@/services/constant';
import { categoryContext } from './_app';
import { MdFileDownload } from "react-icons/md";

function orders(props) {
    const router = useRouter();
    const [ordersData, setOrdersData] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const [reviewsData, setReviewsData] = useState({
        description: '',
        reviews: 0,
    })
    const [productId, setProductId] = useState('');
    const [reviews, setReviews] = useState('product');
    const [sellerId, setSellerId] = useState('')
    const { t } = useTranslation();
    const [categoryType, setCategoryType] = useContext(categoryContext);

    useEffect(() => {
        getProductRequestbyUser()
    }, [categoryType])


    const getProductRequestbyUser = async () => {
        props.loader(true);
        Api("get", `getProductRequestbyUser?type=${categoryType}`, "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setOrdersData(res.data);
                console.log(res.data)
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const createProductRquest = (e) => {
        e.preventDefault();
        if (reviewsData?.reviews === 0) {
            props.toaster({ type: "success", message: 'Rating is required' });
            return
        }

        let data = {
            description: reviewsData?.description,
            // product: productId,
            rating: reviewsData?.reviews,
        }

        if (reviews === 'product') {
            data.product = productId
        } else {
            data.seller = sellerId
        }

        console.log(data)
        props.loader(true);
        Api("post", 'giverate', data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    setShowReviews(false)
                    setReviewsData({
                        description: '',
                        reviews: "",
                    });
                    setProductId('')
                    setSellerId('')
                    props.toaster({ type: "success", message: res.data?.message });

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

    const GeneratePDF = (orderId) => {
        const data = {
            orderId: orderId,
        };
        ApiGetPdf("createinvoice", data, router)
            .then(() => console.log("PDF downloaded/opened successfully"))
            .catch((err) => console.error("Failed to fetch PDF", err));
    };

    return (
        <div className="bg-white w-full">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="md:px-10 mx-auto w-full  px-5 md:pt-10 pt-5 md:pb-10 pb-5 md:min-h-screen">
                    <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-5'>
                        {ordersData.map((item, i) => (<div key={i} className='grid md:grid-cols-3 grid-cols-1 w-full gap-5 bg-white shadow-2xl p-5 rounded-[10px]' >
                            <div className='col-span-2 flex gap-5'>
                                <img className='w-20 h-20 rounded-[10px] object-contain' src={item?.productDetail?.image[0]} onClick={() => { router.push(`/orders-details/${item?._id}?product_id=${item?.productDetail?._id}`) }} />
                                <div>
                                    <p className='text-black text-base font-bold'>{item?.productDetail?.product?.name}</p>
                                    {item?.productDetail?.color && <div className='flex justify-start items-center pt-[6px]'>
                                        <p className='text-custom-gray text-xs font-bold'>{t("Color")}:</p>
                                        <p className="h-[10px] w-[10px] rounded-full border border-black ml-2" style={{ backgroundColor: item?.productDetail?.color }}></p>
                                    </div>}
                                    {item?.category_type === 'Products' && <p className='text-custom-gray text-xs font-bold pt-[6px]'>{t("Quantity")}: {item?.productDetail?.qty || 1}</p>}
                                    {item?.rooms && <p className='text-custom-gray text-xs font-bold pt-[6px]'>{t("Rooms")}: {item?.rooms}</p>}
                                    <p className='text-custom-gray text-xs font-bold pt-[6px]'>{t("Order ID")}: {item?.orderId || item?._id}</p>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex justify-end items-center gap-2'>
                                    <p className='text-custom-red text-base font-bold text-right'>{constant?.currency}{item?.productDetail?.total}</p>
                                    <MdFileDownload className="text-xl text-black"
                                        onClick={() => GeneratePDF(item._id)}
                                    />
                                </div>
                                <div className='flex justify-end items-end mt-2'>
                                    <button className='bg-custom-newDarkBlack h-[30px] w-24 rounded-[5px] text-white font-semibold text-sm' onClick={() => { setShowReviews(true); setProductId(item?.productDetail?.product?._id); setSellerId(item?.productDetail?.seller_id) }}>{t("Reviews")}</button>
                                </div>
                            </div>
                        </div>))}
                    </div>

                    {showReviews && <div className="fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50">
                        <div className="relative w-[300px] md:w-[360px] h-auto  bg-white rounded-[15px] m-auto">
                            <div className="absolute top-2 right-2 p-1 rounded-full  text-black w-8 h-8 cursor-pointer"
                                onClick={() => { setShowReviews(false) }}
                            >
                                <RxCrossCircled className="h-full w-full font-semibold " />
                            </div>

                            <form className='px-5 py-5' onSubmit={createProductRquest}>
                                <p className='text-black font-bold text-2xl mb-5'>{t("Reviews")}</p>

                                <div className='flex justify-center items-center mb-5 gap-5'>
                                    <button className={`h-[30px] w-32 rounded-[5px] text-black font-semibold text-sm ${reviews === 'product' ? 'underline underline-offset-8' : ''} `} onClick={() => { setReviews('product') }}>{t("Product")}</button>
                                    <button className={`h-[30px] w-32 rounded-[5px] text-black font-semibold text-sm ${reviews === 'product' ? '' : 'underline underline-offset-8'}`} onClick={() => { setReviews('seller') }}>{t("Seller")}</button>
                                </div>

                                <div className='flex flex-col justify-center items-center  border border-custom-newGray rounded-[10px] py-3 mb-5'>
                                    <Box sx={{ width: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Rating
                                            name="text-feedback"
                                            value={reviewsData?.reviews}
                                            onChange={(e, value) => {
                                                console.log(e, value)
                                                setReviewsData({ ...reviewsData, reviews: value });
                                            }}
                                            precision={0.5}
                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                        {/* <Box sx={{ ml: 2 }}>rating</Box> */}
                                    </Box>
                                    <p className='text-black font-bold text-center text-base mt-2'>{t("Rated")} {Number(reviewsData?.reviews || 0)?.toFixed(1)}{t("/5.0 by users")}</p>
                                </div>


                                <div className='w-full'>
                                    <textarea className="bg-white md:w-full w-full px-5 py-2 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" rows={4} placeholder={t("Description")}
                                        value={reviewsData.description}
                                        onChange={(e) => {
                                            setReviewsData({ ...reviewsData, description: e.target.value });
                                        }}
                                        required
                                    />
                                </div>



                                <div className='flex md:justify-start justify-center'>
                                    <button className='bg-custom-gray w-full md:h-[50px] h-[40px] rounded-[5px] text-white font-normal text-base' type="submit">{t("Submit")}</button>
                                </div>

                            </form>
                        </div>
                    </div>}

                    {ordersData?.length === 0 && (<div className='md:h-[500px] h-[200px] flex justify-center items-center'>
                        <p className="text-2xl text-black font-normal text-center">{t("No Products")}</p>
                    </div>)}

                </div>
            </section>
        </div >
    )
}

export default orders
