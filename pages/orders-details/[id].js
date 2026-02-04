import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { useTranslation } from "react-i18next";
import moment from "moment";

/* ---------- Reusable Card Component ---------- */
const InfoCard = ({ title, children }) => (
  <div className="border border-gray-200 rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
    <h2 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-6 border-b border-gray-100 pb-4">
      {title}
    </h2>
    {children}
  </div>
);

const ProductItem = ({ item, t }) => {
  const [activeImage, setActiveImage] = useState(item?.image?.[0] || "");

  const imageOnError = (e) => {
    e.currentTarget.src = "/default-product-image.png";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
      {/* Image */}
      <div className="flex justify-center items-center bg-gray-50 rounded-xl border border-gray-100 mb-4">
        <img
          src={activeImage}
          alt="Product"
          onError={imageOnError}
          className="w-full max-h-[300px] object-contain p-4 hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {item?.product?.name}
        </h3>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">{t("Price")}</span>
            <span className="text-xl font-extrabold text-black">
              €{item?.price || 0}
            </span>
          </div>

          {item?.color && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{t("Colour")}</span>
              <span className="font-semibold uppercase text-gray-800">
                {item.color}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{t("Quantity")}</span>
            <span className="font-semibold text-gray-800">
              {item?.qty || 0} Units
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function OrdersDetails(props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (router?.query?.id) {
      getOrderDetails();
    }
  }, [router?.query?.id]);

  const getOrderDetails = async () => {
    props.loader(true);
    try {
      const res = await Api(
        "get",
        `getProductRequest/${router.query.id}`,
        "",
        router,
      );
      setOrderData(res?.data);
      props.loader(false);
    } catch (err) {
      props.loader(false);
      props.toaster({ type: "error", message: err?.message });
    }
  };

  if (!orderData) return null;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      <section className="max-w-6xl mx-auto px-6 pt-12">
        {/* Header Section */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Order #{orderData?.orderId}
            </span>
            <h1 className="md:text-4xl text-2xl font-black text-black mt-2 tracking-tight">
              Order Details
            </h1>
          </div>
          <p> Category type: </p>
          <span className="bg-black text-white text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-widest mb-1">
            {orderData?.category_type || "Order"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orderData?.productDetail?.map((item, index) => (
            <ProductItem key={index} item={item} t={t} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {orderData?.category_type === "Products" && (
            <InfoCard title={t("Shipping Address")}>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">
                    {t("Recipient")}
                  </p>
                  <p className="font-bold text-black text-lg">
                    {orderData?.shiping_address?.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase">
                    {t("Location")}
                  </p>
                  <p className="font-medium text-gray-700 leading-relaxed">
                    {orderData?.shiping_address?.address},{" "}
                    {orderData?.shiping_address?.city}
                    <br />
                    {orderData?.shiping_address?.country?.label} -{" "}
                    {orderData?.shiping_address?.pinCode}
                  </p>
                </div>
              </div>
            </InfoCard>
          )}

          <InfoCard title={t("Customer Contact")}>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                  {orderData?.user?.username?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Customer Name
                  </p>
                  <p className="font-bold text-black text-lg">
                    {orderData?.user?.username}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-50">
                <a
                  href={`mailto:${orderData?.user?.email}`}
                  className="group block"
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                    {t("Email Address")}
                  </span>
                  <p className="text-black font-medium group-hover:text-blue-600 transition-colors">
                    {orderData?.user?.email}
                  </p>
                </a>
                <a
                  href={`tel:${orderData?.user?.number}`}
                  className="group block"
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                    {t("Phone Number")}
                  </span>
                  <p className="text-black font-medium group-hover:text-blue-600 transition-colors">
                    {orderData?.user?.number}
                  </p>
                </a>
              </div>
            </div>
          </InfoCard>
        </div>
      </section>
    </div>
  );
}

export default OrdersDetails;
