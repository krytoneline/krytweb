import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { cartCompareContext, cartContext, categoryContext } from '@/pages/_app';
import { MdHighQuality } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { Api } from '@/services/service';
import { useTranslation } from "react-i18next";
import constant from '@/services/constant';
import { IoRemoveSharp } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { produce } from "immer"

function ProductCard({ item, i, url, section, toaster }) {
    const router = useRouter()
    const [cartData, setCartData] = useContext(cartContext);

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [cartCompareData, setCartCompareData] = useContext(cartCompareContext);
    const { t } = useTranslation();
    const [categoryType, setCategoryType] = useContext(categoryContext);

    useEffect(() => {
        // console.log(cartData)
        const index = cartData.findIndex(f => f._id === item?._id)
        console.log(index)
        setSelectedIndex(index)
    }, [cartData])

    const sponsoredProduct = async () => {
        if (section) {
            charngeCPC()
        } else {
            router.push(url)
        }
    }

    const charngeCPC = () => {
        let data = {
            seller: item?.userid
        }
        Api("post", 'chargeCPC', data, router).then(
            (res) => {
                // console.log("res================>", res);
                if (res.status) {
                    router.push(url)
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    return (
        <div className="w-full bg-custom-lightGrayColors !-z-30" >
            <div className='w-full h-48 xl:h-72 bg-[#F4F4F4] overflow-hidden'>
                <img className="object-contain object-center cursor-pointer h-full w-full" height={'100%'} width={'100%'} src={item?.varients[0]?.image[0]} onClick={() => { sponsoredProduct() }} />
            </div>
            <div className='md:p-5 p-3'>
                <div className='w-full grid grid-cols-6'>
                    <div className='col-span-4'>
                        <p className="text-base font-normal	text-custom-black line-clamp-2 h-[45px] cursor-pointer" onClick={() => { sponsoredProduct() }}>{item?.name}</p>
                        {/* <p className='line-clamp-2 h-[45px] text-white bg-black'>Lorem Ipsum is simply dummy text of the printing</p> */}
                    </div>
                    {(item?.is_verified || item?.is_quality) && <div className='col-span-2 justify-end -mr-3  right-0 top-0  flex gap-1 border-0 border-custom-red'>
                        {item?.is_verified && <MdVerified className='text-3xl text-green-800' />}
                        {item?.is_quality && <MdHighQuality className='text-3xl text-custom-red' />}
                    </div>}
                </div>
                <div className="pt-2 flex justify-between items-center">
                    {item?.price && item?.offer && categoryType === 'Products' && <p className="text-lg font-semibold	text-custom-black">{constant?.currency}{item?.price} <br /> <del className="text-custom-lightGrayColor"> {constant?.currency}{item?.offer}</del></p>}
                    {item?.attributes[0]?.name && item?.attributes[0]?.value && categoryType === 'Business' && <p className="text-lg font-semibold	text-custom-black">{item?.attributes[0]?.name} <br /> <span className="text-custom-lightGrayColor"> {constant?.currency}{item?.attributes[0]?.value}</span></p>}
                    {selectedIndex === -1 && categoryType === 'Products' && <button type='button' className="text-base font-semibold text-custom-black cursor-pointer"
                        onClick={() => {
                            let d = cartData?.length > 0 ? cartData : []
                            const c = d.find(f => f._id === item?._id && f.selectedColor?.color === item?.varients[0].color)
                            if (!c) {
                                let newD = {
                                    ...item,
                                    qty: 1,
                                    total: item.price,
                                    image: item?.varients[0].image[0]
                                }
                                if (item?.varients[0].color) {
                                    newD.selectedColor = item?.varients[0].color
                                }
                                const nextState = produce(cartData, draft => {
                                    draft.push(newD)
                                })
                                setCartData(nextState)
                                const index = nextState.findIndex(f => f._id === item?._id)
                                console.log(index)
                                setSelectedIndex(index)
                                localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                            } else {
                                const nextState = produce(cartData, draft => {
                                    let index = draft.find(f => f._id === item._id)
                                    index.qty = index.qty + productsId.qty
                                })
                                setCartData(nextState)
                                localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                            }
                            // router.push('/cart')
                        }}>{t("+ Add to Cart")}</button>}

                    {selectedIndex !== -1 && <div className='border border-custom-newOffWhite max-w-max h-[30px] rounded-[15px] md:mt-5 mt-3 flex items-center'>
                        <button type='button' className='h-[30px] w-[30px] bg-custom-newLightGrays rounded-[15px] flex justify-center items-center cursor-pointer'
                            onClick={() => {
                                if (cartData[selectedIndex].qty > 1) {
                                    const nextState = produce(cartData, draft => {
                                        draft[selectedIndex].qty = draft[selectedIndex].qty - 1
                                        draft[selectedIndex].total = (draft[selectedIndex]?.price * draft[selectedIndex].qty).toFixed(2)
                                    })
                                    setCartData(nextState)
                                    localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                                } else {
                                    const nextState = produce(cartData, draftState => {
                                        if (selectedIndex !== -1) {
                                            draftState.splice(selectedIndex, 1);
                                        }
                                    })
                                    setSelectedIndex(-1)
                                    if (nextState) {
                                        setCartData(nextState)
                                        localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                                    } else {
                                        setCartData([])
                                        localStorage.removeItem("addCartDetail");
                                    }
                                }
                            }}>
                            <IoRemoveSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                        </button>
                        {cartData.length > 0 && cartData[selectedIndex]?.qty && <p className='text-custom-newDarkBlack text-base font-normal text-center mx-4'>{cartData[selectedIndex]?.qty}</p>}
                        <button type='button' className='h-[30px] w-[30px] bg-white border border-custom-newOffWhite rounded-[15px] flex justify-center items-center cursor-pointer'
                            onClick={() => {
                                const nextState = produce(cartData, draft => {
                                    draft[selectedIndex].qty = draft[selectedIndex].qty + 1
                                    draft[selectedIndex].total = (draft[selectedIndex]?.price * draft[selectedIndex].qty).toFixed(2)
                                })
                                setCartData(nextState)
                                localStorage.setItem("addCartDetail", JSON.stringify(nextState));
                            }}>
                            <IoAddSharp className='h-[15px] w-[15px] text-custom-newDarkBlack' />
                        </button>
                    </div>}

                </div>
                <div className='pt-2 flex justify-start items-center'>
                    <input className='h-4 w-4' type='checkbox' checked={cartCompareData.map(d => d._id).includes(item._id)}
                        onClick={() => {
                            localStorage.setItem("CompareClose", "open")
                            let d = cartCompareData || []
                            // console.log(d, cartCompareData)
                            let c = d.find(f => f._id === item?._id)
                            let checkCat = d.find(f => f.category?._id === item?.category?._id)

                            if (!c) {
                                if (cartCompareData.length === 0 || (cartCompareData.length > 0 && checkCat?._id)) {
                                    item.total = item.price
                                    item.qty = 1
                                    // console.log(item)
                                    if (d.length === 0) {
                                        d = [item]
                                    } else {
                                        d.push(item)
                                    }
                                    setCartCompareData([...d])
                                    localStorage.setItem("addCartCompare", JSON.stringify(d));
                                } else {
                                    // if ()
                                    toaster({ type: "error", message: "You can not add different category in the comparison" });
                                }
                            } else {
                                let c = d.filter(f => f._id !== item?._id)
                                setCartCompareData([...c])
                                localStorage.setItem("addCartCompare", JSON.stringify(c));
                            }


                        }}
                    />
                    <p className="text-base font-semibold text-custom-black  ml-5">{t("Add to Compare")}</p>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
