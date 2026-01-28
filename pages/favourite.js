import { Api } from "@/services/service";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductCard from "@/components/ProductCard";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";

function Favourite(props) {
  const router = useRouter();
  const [ordersData, setOrdersData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getFavourite();
  }, []);

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
      },
    );
  };

  return (
    <div className="bg-white w-full">
      <section className="bg-white w-full flex flex-col justify-center items-center">
        <div className="max-w-7xl mx-auto w-full md:px-0 px-5 md:pt-10 pt-5 md:pb-10 pb-5">
          {/* <p className="text-2xl text-black font-bold pb-5">
            {t("My Favourite Product")}
          </p> */}
          <div className="md:mb-3 mb-3">
            <p className="text-sm text-gray-600">
              <span
                className="hover:text-gray-900 cursor-pointer"
                onClick={() => router.push("/")}
              >
                Home
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">My Favourite</span>
            </p>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">
            {ordersData.map((item, i) => (
              <div key={i} className="w-[290px] flex-shrink-0 ">
                <ProductCard
                  {...props}
                  item={item?.product}
                  i={i}
                  url={`/product-detail/${item?.product?.slug}`}
                />
              </div>
            ))}
          </div>
          {ordersData?.length === 0 && (
            <div className="w-full md:h-[500px] h-[200px] flex flex-col justify-center items-center gap-3 text-center">
              <Heart className="w-12 h-12 text-gray-800" />
              <p className="text-xl font-semibold text-gray-800">
                {t("No Favorite Products")}
              </p>
              <p className="text-sm text-gray-500 max-w-md">
                {t("You haven't added any products to your favorites yet.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Favourite;
