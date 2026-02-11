import { Api, ApiGetPdf } from "@/services/service";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { RxCrossCircled } from "react-icons/rx";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";
import constant from "@/services/constant";
import { categoryContext } from "./_app";
import { MdFileDownload } from "react-icons/md";
import { PackageOpen } from "lucide-react";

function orders(props) {
  const router = useRouter();
  const [ordersData, setOrdersData] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewsData, setReviewsData] = useState({
    description: "",
    reviews: 0,
  });
  const [productId, setProductId] = useState("");
  const [reviews, setReviews] = useState("product");
  const [sellerId, setSellerId] = useState("");
  const { t } = useTranslation();
  const [expandedOrders, setExpandedOrders] = useState({});

  const [categoryType, setCategoryType] = useContext(categoryContext);

  useEffect(() => {
    getProductRequestbyUser();
  }, [categoryType]);

  console.log(ordersData);

  const getProductRequestbyUser = async () => {
    props.loader(true);
    Api("get", `getrequestProduct?type=${categoryType}`, "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setOrdersData(res.data);
        console.log(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const createProductRquest = (e) => {
    e.preventDefault();
    if (reviewsData?.reviews === 0) {
      props.toaster({ type: "success", message: "Rating is required" });
      return;
    }

    let data = {
      description: reviewsData?.description,
      // product: productId,
      rating: reviewsData?.reviews,
    };

    if (reviews === "product") {
      data.product = productId;
    } else {
      data.seller = sellerId;
    }

    console.log(data);
    props.loader(true);
    Api("post", "giverate", data, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res.status) {
          setShowReviews(false);
          setReviewsData({
            description: "",
            reviews: "",
          });
          setProductId("");
          setSellerId("");
          props.toaster({ type: "success", message: res.data?.message });
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

  const GeneratePDF = (orderId) => {
    const data = {
      orderId: orderId,
    };
    ApiGetPdf("createinvoice", data, router)
      .then(() => console.log("PDF downloaded/opened successfully"))
      .catch((err) => console.error("Failed to fetch PDF", err));
  };
  const toggleOrderExpansion = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white w-full">
      <section className="bg-white w-full flex flex-col justify-center items-center">
        <div className="max-w-7xl md:px-0 mx-auto w-full  px-5 pt-5  pb-5 md:min-h-screen">
          <div className="md:mb-3 mb-3">
            <p className="text-sm text-gray-600">
              <span
                className="hover:text-gray-900 cursor-pointer"
                onClick={() => router.push("/")}
              >
                {t("Home")}
              </span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{t("Order")}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            {ordersData.map((item) => {
              const firstProduct = item.productDetail?.[0];
              const hasMultiple = item.productDetail?.length > 1;

              return (
                <div
                  key={item._id}
                  className="bg-white border rounded-xl p-5 space-y-4 hover:shadow-lg transition"
                >
                  {/* TOP SECTION */}
                  <div className="flex justify-between gap-5">
                    <div className="flex gap-4">
                      <img
                        src={firstProduct?.image?.[0]}
                        className="w-20 h-20 rounded-lg object-contain cursor-pointer border"
                        onClick={() =>
                          router.push(
                            `/product-detail/${firstProduct?.product?.slug}`,
                          )
                        }
                      />

                      <div className="space-y-1">
                        <p className="text-base font-semibold text-black">
                          {firstProduct?.product?.name}
                        </p>

                        {firstProduct?.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {t("Color")}:
                            </span>
                            <span
                              className="h-3 w-3 rounded-full border"
                              style={{ backgroundColor: firstProduct.color }}
                            />
                          </div>
                        )}

                        <p className="text-xs text-gray-500">
                          {t("Quantity")}: {firstProduct?.qty || 1}
                        </p>

                        <p className="text-xs text-gray-400">
                          {t("Order ID")}: {item?.orderId || item?._id}
                        </p>

                        {hasMultiple && (
                          <button
                            onClick={() => toggleOrderExpansion(item._id)}
                            className="text-xs underline text-black mt-1"
                          >
                            {expandedOrders[item._id]
                              ? "Hide other items"
                              : `+ ${item.productDetail.length - 1} more item(s)`}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-custom-red">
                          {constant.currency}
                          {firstProduct?.total || firstProduct?.price}
                        </p>

                        <MdFileDownload
                          className="text-xl text-black cursor-pointer"
                          onClick={() => GeneratePDF(item._id)}
                        />
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            setShowReviews(true);
                            setProductId(firstProduct?.product?._id);
                            setSellerId(firstProduct?.seller_id);
                          }}
                          className="px-4 h-8 bg-black text-white text-xs rounded-md hover:bg-gray-900"
                        >
                          {t("Review")}
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/orders-details/${item?._id}`)
                          }
                          className="px-4 h-8 border text-xs rounded-md text-black hover:bg-gray-100"
                        >
                          {t("View Details")}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* EXPANDED OTHER PRODUCTS */}
                  {hasMultiple &&
                    expandedOrders[item._id] &&
                    item.productDetail.slice(1).map((prod, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between gap-4 bg-gray-50 p-4 rounded-lg border"
                      >
                        <div className="flex gap-3">
                          <img
                            src={prod?.image?.[0]}
                            className="w-16 h-16 rounded object-contain border cursor-pointer"
                          />

                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-black">
                              {prod?.product?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {t("Qty")}: {prod?.qty}
                            </p>

                            {prod?.attribute &&
                              Object.entries(prod.attribute)
                                .filter(([k]) => k.toLowerCase() !== "color")
                                .map(([k, v]) => (
                                  <p key={k} className="text-xs text-gray-500">
                                    {k}: {v}
                                  </p>
                                ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <p className="text-sm font-bold text-custom-red">
                            {constant.currency}
                            {prod?.price}
                          </p>

                          <button
                            onClick={() => {
                              setShowReviews(true);
                              setProductId(prod?.product?._id);
                              setSellerId(prod?.seller_id);
                            }}
                            className="px-4 h-8 border text-xs rounded-md text-black hover:bg-gray-100 mt-2"
                          >
                            {t("Review")}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>

          {showReviews && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
              {/* Modal Card */}
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
                {/* Close Button */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                  onClick={() => setShowReviews(false)}
                >
                  <RxCrossCircled className="text-2xl text-gray-700" />
                </button>

                <form className="px-6 py-6" onSubmit={createProductRquest}>
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {t("Reviews")}
                  </h2>

                  {/* Tabs */}
                  <div className="flex justify-center bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                      type="button"
                      onClick={() => setReviews("product")}
                      className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
                        reviews === "product"
                          ? "bg-white shadow text-black"
                          : "text-gray-500"
                      }`}
                    >
                      {t("Product")}
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviews("seller")}
                      className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${
                        reviews === "seller"
                          ? "bg-white shadow text-black"
                          : "text-gray-500"
                      }`}
                    >
                      {t("Seller")}
                    </button>
                  </div>

                  {/* Rating Box */}
                  <div className="flex flex-col items-center border border-gray-200 rounded-xl py-4 mb-6 shadow-sm">
                    <Box
                      sx={{
                        width: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Rating
                        name="text-feedback"
                        value={reviewsData?.reviews}
                        onChange={(e, value) =>
                          setReviewsData({ ...reviewsData, reviews: value })
                        }
                        precision={0.5}
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.4 }}
                            fontSize="inherit"
                          />
                        }
                      />
                    </Box>

                    <p className="text-gray-700 font-semibold mt-2">
                      {t("Rated")}{" "}
                      {Number(reviewsData?.reviews || 0).toFixed(1)} {t("/5.0")}
                    </p>
                  </div>

                  {/* Description */}
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none text-gray-800 mb-6"
                    rows={4}
                    placeholder={t("Description")}
                    value={reviewsData.description}
                    onChange={(e) =>
                      setReviewsData({
                        ...reviewsData,
                        description: e.target.value,
                      })
                    }
                    required
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-[48px] rounded-xl bg-black text-white font-semibold text-base shadow-md hover:shadow-lg transition"
                  >
                    {t("Submit")}
                  </button>
                </form>
              </div>
            </div>
          )}

          {ordersData?.length === 0 && (
            <div className="md:h-[500px] h-[260px] flex flex-col justify-center items-center gap-4 bg-[#00000005] rounded-xl">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-black/5">
                <PackageOpen className="h-8 w-8 text-gray-600" />
              </div>

              <p className="text-xl md:text-2xl text-black font-semibold text-center">
                {t("No Order Found")}
              </p>

              <p className="text-sm text-gray-500 text-center max-w-md">
                {t(
                  "You haven’t placed any orders yet. Once you do, they’ll appear here",
                )}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default orders;
