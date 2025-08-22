import { Api } from '@/services/service';
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import ProductCard from '@/components/ProductCard';
import { useTranslation } from "react-i18next";

function Favourite(props) {
    const router = useRouter();
    const [ordersData, setOrdersData] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        getFavourite()
    }, [])

    const getFavourite = async () => {
        props.loader(true);
        Api("get", "getFavourite", "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setOrdersData(res.data);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <div className="bg-white w-full">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="mx-auto w-full md:px-10 px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <p className='text-2xl text-black font-bold pb-5'>{t("My Favourite Product")}</p>
                    <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">
                        {ordersData.map((item, i) => (
                            <div key={i} className='w-full'>
                                <ProductCard {...props} item={item?.product} i={i} url={`/product-detail/${item?.product?.slug}`} />
                            </div>
                        ))}
                    </div>
                    {ordersData?.length === 0 && <div className='w-full md:h-[500px] h-[200px] flex justify-center items-center'>
                        <p className="text-2xl text-black font-normal text-center">{t("No Products")}</p>
                    </div>}
                </div>
            </section>
        </div>
    )
}

export default Favourite
