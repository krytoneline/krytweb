import ProductCard from "@/components/ProductCard";
import React, { useContext, useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import FormControl from "@mui/material/FormControl";
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaCircleChevronUp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { categoryContext, categoryListContext } from "../_app";

const limit = 24;

const sortByData = [
  {
    name: "Featured",
    value: "featured",
  },
  {
    name: "Best selling",
    value: "is_top",
  },
  {
    name: "Alphabetically, A-Z",
    value: "a_z",
  },
  {
    name: "Alphabetically, Z-A",
    value: "z_a",
  },
  {
    name: "Price, low to high",
    value: "low",
  },
  {
    name: "Price, high to low",
    value: "high",
  },
  {
    name: "Date, old to new",
    value: "old",
  },
  {
    name: "Date, new to old",
    value: "new",
  },
];

function Categories(props) {
  const router = useRouter();
  console.log(router);
  const [productList, SetProductList] = useState([]);
  const [category, setCategory] = useState({});
  const [categoryList, SetCategoryList] = useContext(categoryListContext);
  const [selectedCategories, setSelectedCategories] = useState("");
  const [selectedSortBy, setSelectedSortBy] = useState("");
  const [openData, setOpenData] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const { t } = useTranslation();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [categoryType, setCategoryType] = useContext(categoryContext);

  useEffect(() => {
    SetProductList([]);
    getproductByCategory(router?.query?.cat_id, 1);
    setSelectedCategories(router?.query?.cat_id);
  }, [router]);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getCategory();
  }, [categoryType]);

  useEffect(() => {
    if (selectedCategories) {
      getproductByCategory(selectedCategories, 1);
    }
  }, [selectedSortBy]);

  useEffect(() => {
    if (router?.query?.cat_id) {
      router.replace(`/categories/${router?.query?.cat_id}`);
      setSelectedCategories(router?.query?.cat_id);
    }
  }, [categoryType]);

  const getCategory = async (cat) => {
    Api("get", `getCategory?type=${categoryType}`, "", router).then(
      (res) => {
        SetCategoryList([...res.data]);
      },
      (err) => {
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const getproductByCategory = async (cat, p) => {
    props.loader(true);
    let parmas = {};
    let url = `getProductBycategoryId`;
    parmas.page = p;
    parmas.limit = limit;
    if (cat) {
      parmas.category = cat;
    }
    parmas.type = categoryType;
    if (selectedSortBy) {
      parmas.sort_by = selectedSortBy;
    }
    Api("get", url, "", router, parmas).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (p === 1) {
          SetProductList(res.data);
        } else {
          SetProductList([...productList, ...res.data]);
        }

        if (res.data.length < limit) {
          setHasMore(false);
          setPage(1);
        } else {
          setHasMore(true);
          setPage(p + 1);
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
    <div className="bg-gray-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 md:px-5 py-6">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setOpenCategory(!openCategory)}
            className="w-full bg-white text-black border rounded-lg py-3 font-medium shadow-sm"
          >
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div
            className={`${
              openCategory ? "block" : "hidden"
            } md:block w-full md:w-1/4 bg-white rounded-xl shadow-sm p-5 md:sticky md:top-20 h-fit`}
          >
            <div className="border-b pb-5 mb-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-800">
                  {t("Sort By")}
                </h3>
                <button onClick={() => setOpenData(!openData)}>
                  {openData ? <FaCircleChevronUp className="text-black"/> : <FaCircleChevronDown className="text-black"/>}
                </button>
              </div>

              {openData && (
                <FormGroup>
                  {sortByData.map((item, i) => (
                    <FormControlLabel
                      key={i}
                      className="text-black"
                      control={
                        <Checkbox
                          checked={item.value === selectedSortBy}
                          onChange={() => {
                            SetProductList([]);
                            if (selectedSortBy === item.value) {
                              setSelectedSortBy("");
                            } else {
                              setSelectedSortBy(item.value);
                            }
                          }}
                        />
                      }
                      label={item.name}
                    />
                  ))}
                </FormGroup>
              )}
            </div>

       
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-800">
                  {t("Categories")}
                </h3>
                <button onClick={() => setOpenCategory(!openCategory)}>
                  {openCategory ? (
                    <FaCircleChevronUp className="text-black"/>
                  ) : (
                    <FaCircleChevronDown className="text-black"/>
                  )}
                </button>
              </div>

              {openCategory && (
                <FormGroup>
                  <FormControlLabel
                    className="text-black"
                    control={
                      <Checkbox
                        checked={"all" === selectedCategories}
                        onChange={() => {
                          SetProductList([]);
                          router.replace(`/categories/all`);
                          setSelectedCategories("all");
                        }}
                      />
                    }
                    label="All"
                  />

                  {categoryList.map((item, i) => (
                    <FormControlLabel
                      key={i}
                      className="text-black"
                      control={
                        <Checkbox
                          checked={item.slug === selectedCategories}
                          onChange={() => {
                            SetProductList([]);
                            router.replace(`/categories/${item.slug}`);
                            setSelectedCategories(item.slug);
                          }}
                        />
                      }
                      label={item.name}
                    />
                  ))}
                </FormGroup>
              )}
            </div>
          </div>

          <div className="w-full md:w-3/4">
          
            <div className="bg-white rounded-xl shadow-sm p-4 mb-5 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                {productList.length} Products
              </h2>
            </div>

            {/* Product Grid */}
            {productList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {productList.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <ProductCard
                      {...props}
                      item={item}
                      i={i}
                      url={`/product-detail/${item?.slug}?from=categories`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex justify-center items-center">
                <p className="text-xl text-gray-600">{t("No Products")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Categories;
