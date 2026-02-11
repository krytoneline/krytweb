import { useState, useEffect, useContext } from "react";
import ProductCard from "@/components/ProductCard";
import { MdNavigateNext } from "react-icons/md";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { useTranslation } from "react-i18next";
import { categoryContext, categoryListContext, userContext } from "./_app";
import MainHeader from "@/components/MainHeader";
import CategoryCard from "@/components/CategoryCard";
import { MoveRight } from "lucide-react";

export default function Home(props) {
  const router = useRouter();
  const [productsList, setProductsList] = useState([]);
  const [carouselImg, setCarouselImg] = useState([]);
  const [sponsoredProductData, setSponsoredProductData] = useState([]);
  const [categoryList, SetCategoryList] = useContext(categoryListContext);
  const { t } = useTranslation();
  const [categoryType, setCategoryType] = useContext(categoryContext);

  useEffect(() => {
    getProduct();
    getCategory();
    getsetting();
    getSponsoredProduct();
  }, []);

  useEffect(() => {
    console.log(categoryType);
    getCategory();
    getProduct();
    getSponsoredProduct();
  }, [categoryType]);

  const getSponsoredProduct = async () => {
    props.loader(true);
    Api("get", `getSponseredProduct?type=${categoryType}`, "", router).then(
      (res) => {
        props.loader(false);
        setSponsoredProductData(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const getProduct = async () => {
    props.loader(true);
    Api("get", `getProduct?type=${categoryType}`, "", router).then(
      (res) => {
        props.loader(false);
        setProductsList(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const getCategory = async () => {
    props.loader(true);
    Api("get", `getCategory?type=${categoryType}`, "", router).then(
      (res) => {
        props.loader(false);
        SetCategoryList([...res.data]);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const getsetting = async () => {
    props.loader(true);
    Api("get", "getsetting", "", router).then(
      (res) => {
        props.loader(false);
        if (res?.success) {
          if (res?.setting.length > 0) {
            setCarouselImg(res?.setting[0].carousel);
          }
        } else {
          props.loader(false);
          console.log(res?.data?.message);
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

  return (
    <div className=" w-full max-w-7xl mx-auto ">
      <MainHeader carouselImg={carouselImg} />

      <section className="md:px-0 px-5 mx-auto w-full py-5">
        <div className="w-full flex justify-between items-center">
          <p className="text-black font-bold text-[20px] md:text-3xl">
            {t("All Category")}
          </p>
          <p className="text-black flex gap-1 text-sm md:text-lg  cursor-pointer underline"
          onClick={()=> router.push("/categories/all")}
          
          >
            {t("Show More")}
            <MoveRight size={20} />
          </p>
        </div>
        <div className="md:grid md:grid-cols-6 flex md:flex-none overflow-x-auto md:overflow-visible gap-5 w-full p-5 md:p-0 scrollbar-hide">
          {categoryList.map((item, i) => (
            <div key={i} className="min-w-[160px] md:min-w-0 flex-shrink-0">
              <CategoryCard {...props} item={item} i={i} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white mx-auto w-full py-5 px-5 md:px-0">
        <div className="flex justify-between items-center pb-5">
          <p className="text-black font-bold text-[20px] md:text-3xl">
            {t("Popular Products")}
          </p>

          <p className="text-black flex gap-1 text-sm md:text-lg underline cursor-pointer"
          onClick={()=> router.push("/categories/all")}
          >
            {t("Show More")}
            <MoveRight size={20} />
          </p>
        </div>

        {productsList?.length > 0 ? (
          <div className="flex md:grid md:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible scrollbar-hide">
            {productsList.map((item, i) => (
              <div key={i} className="w-[290px] flex-shrink-0">
                <ProductCard
                  {...props}
                  item={item}
                  i={i}
                  url={`/product-detail/${item?.slug}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full md:h-[500px] h-[200px] flex flex-col justify-center items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h18v18H3V3zm4 8h10M7 12h6"
                />
              </svg>
            </div>

            <p className="text-xl md:text-2xl font-semibold text-gray-800">
              {t("No Products Found")}
            </p>

            <p className="text-sm md:text-base text-gray-500 max-w-sm">
              {t(
                "We couldn’t find any products right now. Please check back later.",
              )}
            </p>
          </div>
        )}
      </section>

      <section className="bg-white w-full">
        <div className="md:px-0 px-5 mx-auto w-full py-5">
          <div className="flex justify-between items-center pb-5">
            <p className="text-black font-bold text-[20px] md:text-3xl">
              {t("Sponsored product")}
            </p>

            <p className="text-black text-sm flex gap-1 md:text-lg underline cursor-pointer">
              {t("Show More")}
              <MoveRight size={20} />
            </p>
          </div>

          {sponsoredProductData?.length > 0 ? (
            <div className="flex md:grid md:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible scrollbar-hide">
              {sponsoredProductData.map((item, i) => (
                <div key={i} className="w-[290px] flex-shrink-0">
                  <ProductCard
                    {...props}
                    item={item}
                    i={i}
                    url={`/product-detail/${item?.slug}`}
                    section="sponsored"
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full md:h-[500px] h-[200px] flex flex-col justify-center items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
              </div>

              <p className="text-xl md:text-2xl font-semibold text-gray-800">
                {t("No Sponsored Products")}
              </p>

              <p className="text-sm md:text-base text-gray-500 max-w-sm">
                {t("Currently there are no sponsored products available.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
