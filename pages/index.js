import { useState, useEffect, useContext } from "react";
import ProductCard from "@/components/ProductCard";
import { MdNavigateNext } from "react-icons/md";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { useTranslation } from "react-i18next";
import { categoryContext, categoryListContext, userContext } from "./_app";
import { TbCategory } from "react-icons/tb";


export default function Home(props) {
  const router = useRouter();
  const [productsList, setProductsList] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [carouselImg, setCarouselImg] = useState([]);
  const [popularCategoryData, setPopularCategoryData] = useState([]);
  const [sponsoredProductData, setSponsoredProductData] = useState([]);
  const [categoryList, SetCategoryList] = useContext(categoryListContext)

  const { t } = useTranslation();
  const [categoryType, setCategoryType] = useContext(categoryContext);
  const [user, setUser] = useContext(userContext);

  useEffect(() => {
    getProduct()
    getCategory()
    getsetting()
    getPopularCategory()
    getSponsoredProduct()
  }, [])

  useEffect(() => {
    console.log(categoryType)
    getCategory()
    getProduct()
    getSponsoredProduct()
  }, [categoryType])

  const getSponsoredProduct = async () => {
    props.loader(true);
    Api("get", `getSponseredProduct?type=${categoryType}`, "", router).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        setSponsoredProductData(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const getProduct = async () => {
    props.loader(true);
    Api("get", `getProduct?type=${categoryType}`, "", router).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        setProductsList(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };


  const getCategory = async () => {
    props.loader(true);
    Api("get", `getCategory?type=${categoryType}`, "", router).then(
      (res) => {
        props.loader(false);
        SetCategoryList([
          ...res.data]);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const getPopularCategory = async () => {
    props.loader(true);
    Api("get", "getPopularCategory", "", router).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        setPopularCategoryData(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const getsetting = async () => {
    props.loader(true);
    Api("get", 'getsetting', '', router).then(
      (res) => {
        props.loader(false);
        // console.log("res================>", res);
        if (res?.success) {
          if (res?.setting.length > 0) {
            // setSettingsId(res?.setting[0]._id)
            setCarouselImg(res?.setting[0].carousel)
          }
          // props.toaster({ type: "success", message: res?.message });
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
      }
    );
  }

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const dates = [
    {
      url: '/sports-entertainmentBackground.png'
    },
    {
      url: '/sports-entertainmentBackground.png'
    },
    {
      url: '/sports-entertainmentBackground.png'
    },
  ];

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

  const responsivedd = {
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
    <div className="bg-custom-offWhite w-full ">
      <section className="md:px-10  mx-auto w-full md:py-5">
        {user?.token === undefined && <div className="hidden md:flex md:flex-row  flex-col justify-center items-center md:px-0 px-5">
          {/* <img className="w-[99px] h-[36px] md:block hidden" src="/image-5.png" /> */}
          <div className="bg-white md:h-[76px] h-[50px] md:w-[260px] w-full rounded-[50px] md:mx-5 flex justify-start items-center md:mt-0 mt-0">
            <img className="md:w-[60px] w-[30px] md:h-[60px] h-[30px] ml-3" src="/daysImg.png" />
            <p className="text-black md:text-base text-base font-bold ml-3 md:w-[130px] w-full">{t("Lowest prices in 90 days")}</p>
          </div>
          <div className="bg-white md:h-[76px] h-[50px] md:w-[260px] w-full  rounded-[50px] flex justify-start items-center md:mt-0 mt-5">
            <img className="md:w-[60px] w-[30px] md:h-[60px] h-[30px]  ml-3" src="/timeImg.png" />
            <p className="text-black md:text-base text-base font-bold ml-3 md:w-[145px] w-full">{t("On-time Delivery Guarantee")}</p>
          </div>
          <div className="bg-white md:h-[76px] h-[50px] md:w-[260px] w-full  rounded-[50px] md:mx-5 flex justify-start items-center md:mt-0 mt-5">
            <img className="md:w-[60px] w-[30px] md:h-[60px] h-[30px]  ml-3" src="/featuredProductsImg.png" />
            <p className="text-black md:text-base text-base font-bold ml-3 md:w-[160px] w-full">{t("3,000,000 featured products")}</p>
          </div>
          {/* <button className="border border-black rounded-[50px] md:h-[48px] h-[40px] md:w-[152px] w-full text-sm	font-medium	text-black md:mt-0 mt-5">Learn more</button> */}
        </div>}

        <div className="bg-white w-full md:p-5 md:mt-5">
          <div className="grid md:grid-cols-4 grid-cols-1 w-full md:gap-5">

            <div className="md:p-0 p-5 md:order-1 order-2 md:block hidden">
              <p className="text-black text-lg	font-medium border-b border-custom-darkGray pb-5">{t("Categories")}</p>
              <div className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { router.push(`/categories/all`) }}>
                <div className="flex justify-start items-center">
                  <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
                    <TbCategory className="w-[25px] h-[25px] rounded-full text-black" />
                  </div>
                  <p className="text-black text-xs font-normal pl-3">All</p>
                </div>
                <MdNavigateNext className="text-[#00000060] w-7 h-7" />
              </div>

              {categoryList.map((item, i) => (<div key={i} className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { router.push(`/categories/${item.slug}`) }}>
                <div className="flex justify-start items-center">
                  <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
                    {item?.name !== 'All' && <img className="w-[25px] h-[25px] rounded-full" src={item?.image} />}
                    {item?.name === 'All' && <TbCategory className="w-[25px] h-[25px] rounded-full text-black" />}
                  </div>
                  <p className="text-black text-xs font-normal pl-3">{item?.name}</p>
                </div>
                <MdNavigateNext className="text-[#00000060] w-7 h-7" />
              </div>))}
            </div>

            <div className="md:col-span-2 h-full md:mt-5 md:order-2 order-1 md:py-0 py-5 ">
              <Carousel className="h-full"
                responsive={responsive}
                autoPlay={true}
                infinite={true}
                arrows={false}
              >
                {carouselImg.map((d, i) => (
                  <div className='slider flex flex-col justify-center items-center h-full' key={i}>
                    <img className={` w-full object-contain`} src={d} />
                  </div>
                ))}
              </Carousel>
            </div>

            {user?.token === undefined && <div className="md:px-0 px-5 md:my-0 my-5 order-3">
              <p className="text-black text-sm font-normal">{t("Sign up to enjoy  exciting Buyers Club benefits")}</p>
              <button className="text-white text-sm font-bold bg-custom-darkRed rounded-[20px] md:h-[42px] h-[40px] w-full md:mt-10 mt-5" onClick={() => { router.push('/auth/signUp') }}>{t("Join Free")}</button>
              <button className="text-black text-sm font-bold border border-black rounded-[20px] md:h-[42px] h-[40px] w-full mt-5" onClick={() => { router.push('/auth/signIn') }}>{t("Sign in")}</button>
            </div>}
            {user?.token !== undefined && <div className="md:px-0 px-5 md:mb-0 mb-5 order-3 md:flex hidden flex-col justify-center items-center gap-5">
              <div className="bg-custom-offWhite  md:h-[76px] h-[50px] md:w-[260px] w-full rounded-[50px] flex justify-start items-center">
                <img className="md:w-[60px] w-[30px] md:h-[60px] h-[30px] ml-3" src="/daysImg.png" />
                <p className="text-black md:text-base text-base font-bold ml-3 md:w-[130px] w-full">{t("Lowest prices in 90 days")}</p>
              </div>
              <div className="bg-custom-offWhite  md:h-[76px] h-[50px] md:w-[260px] w-full  rounded-[50px] flex justify-start items-center">
                <img className="md:w-[60px] w-[30px] md:h-[60px] h-[30px]  ml-3" src="/timeImg.png" />
                <p className="text-black md:text-base text-base font-bold ml-3 md:w-[145px] w-full">{t("On-time Delivery Guarantee")}</p>
              </div>
              <div className="bg-custom-offWhite  md:h-[76px] h-[50px] md:w-[260px] w-full  rounded-[50px] flex justify-start items-center">
                <img className="md:w-[60px] w-[30px] md:h-[60px] h-[30px]  ml-3" src="/featuredProductsImg.png" />
                <p className="text-black md:text-base text-base font-bold ml-3 md:w-[160px] w-full">{t("3,000,000 featured products")}</p>
              </div>
            </div>}
          </div>
        </div>
      </section>

      <section className="md:px-10 px-5 mx-auto w-full py-5">
        <div className="w-full  rounded-[10px] md:bg-[url('/image-21.png')] bg-custom-darkRed bg-right bg-no-repeat  bg-cover">
          <div className="grid md:grid-cols-4 grid-cols-1 w-full h-full gap-5 md:p-5 p-5">
            <div className="md:pl-5">
              <p className="text-white md:text-[25px] text-2xl font-bold md:w-[150px] leading-[30px]">{t("Categories we have")}</p>
              <p className="text-white text-base font-medium pt-2">{t("How to enjoy reduced-price products, fixed Delivery times, and flexible payments this month")}</p>
              {/* <button className="text-black font-medium text-sm bg-white md:h-[42px] h-[40px] w-[150px] rounded-[20px] mt-5" onClick={() => router.push('/categories')}>Learn more</button> */}
            </div>

            {popularCategoryData.map((item, i) => (<div key={i} className="bg-white md:w-[300px] w-full rounded-[20px] p-5">
              <p className="text-black md:text-lg text-base font-medium">{item?.name}</p>
              <div className="flex gap-5 md:mt-5 mt-2">
                {item?.products.map((img, g) => (<img key={g} className="md:w-[120px] w-full h-[120px]" src={img?.image} />))}
              </div>
            </div>))}

          </div>
        </div>
      </section>

      <section className="md:px-10 mx-auto w-full py-5  px-5 md:block hidden">
        <div className="flex flex-col justify-center items-center pb-5">
          <div className="max-w-max">
            <p className="text-custom-black font-semibold md:text-[26px] text-2xl text-center uppercase w-full">{t("Popular this week")}</p>
            {/* <img src="/image-10.png" /> */}
            <p className="bg-custom-black w-[99px] h-[5px] rounded-full"></p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">
          {productsList.map((item, i) => (
            <div key={i} className="w-full">
              <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}`} />
            </div>
          ))}
        </div>
        {productsList?.length === 0 && <div className='w-full md:h-[500px] h-[200px] flex justify-center items-center'>
          <p className="text-2xl text-black font-normal text-center">{t("No Products")}</p>
        </div>}
      </section>

      <section className="md:px-10 mx-auto w-full py-5  px-5 md:hidden">
        <div className="flex flex-col justify-center items-center pb-5">
          <div className="max-w-max">
            <p className="text-custom-black font-semibold md:text-[26px] text-2xl text-center uppercase w-full">{t("Popular this week")}</p>
            {/* <img src="/image-10.png" /> */}
            <p className="bg-custom-black w-[99px] h-[5px] rounded-full"></p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">
          <Carousel className="z-40"
            responsive={responsived}
            // autoPlay={true}
            infinite={true}
          >
            {productsList.map((item, i) => (
              <div key={i} className="w-full">
                <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}`} />
              </div>
            ))}
          </Carousel>
        </div>
        {productsList?.length === 0 && <div className='w-full md:h-[500px] h-[200px] flex justify-center items-center'>
          <p className="text-2xl text-black font-normal text-center">{t("No Products")}</p>
        </div>}
      </section>

      <section className="bg-white w-full md:block hidden">
        <div className="md:px-10 mx-auto w-full py-5   px-5">
          <div className="flex flex-col justify-center items-center pb-5">
            <div className="max-w-max">
              <p className="text-custom-black font-semibold md:text-[26px] text-2xl uppercase text-center w-full">{t("Sponsored product")}</p>
              {/* <img src="/image-10.png" /> */}
              <p className="bg-custom-black w-[99px] h-[5px] rounded-full"></p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">

            {sponsoredProductData.map((item, i) => (
              <div key={i} className="w-full">
                <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}`} section='sponsored' />
              </div>))}
          </div>
          {sponsoredProductData?.length === 0 && <div className='w-full md:h-[500px] h-[200px] flex justify-center items-center'>
            <p className="text-2xl text-black font-normal text-center">{t("No Products")}</p>
          </div>}
        </div>
      </section>

      <section className="bg-white w-full md:hidden">
        <div className="md:px-10 mx-auto w-full py-5   px-5">
          <div className="flex flex-col justify-center items-center pb-5">
            <div className="max-w-max">
              <p className="text-custom-black font-semibold md:text-[26px] text-2xl uppercase text-center w-full">{t("Sponsored product")}</p>
              {/* <img src="/image-10.png" /> */}
              <p className="bg-custom-black w-[99px] h-[5px] rounded-full"></p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">
            <Carousel className="z-40"
              responsive={responsivedd}
              // autoPlay={true}
              infinite={true}
            >
              {sponsoredProductData.map((item, i) => (
                <div key={i} className="w-full">
                  <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}`} section='sponsored' />
                </div>))}
            </Carousel>
          </div>
          {sponsoredProductData?.length === 0 && <div className='w-full md:h-[500px] h-[200px] flex justify-center items-center'>
            <p className="text-2xl text-black font-normal text-center">{t("No Products")}</p>
          </div>}
        </div>
      </section>

      {/* <section className="bg-custom-offWhite w-full">
        <div className="md:px-10 mx-auto w-full py-5   px-5">
          <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">
            <img className="w-full h-[165px] object-contain" src="/image-13.png" />
            <img className="w-full h-[165px] object-contain" src="/image-14.png" />
            <img className="w-full h-[165px] object-contain" src="/image-15.png" />
            <img className="w-full h-[165px] object-contain" src="/image-16.png" />
          </div>
        </div>
      </section> */}

    </div>
  );
}
