import ProductCard from "@/components/ProductCard";
import React, { useEffect, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";

function Categories(props) {
  const router = useRouter();
  const [productList, SetProductList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (router?.query?.cat_id) {
      productsearch(router?.query?.cat_id);
    }
  }, [router]);


  const productsearch = async (text, cat) => {
    let parmas = {};
    let url = `productsearch?key=${text}`;

    // if (cat) {
    //   parmas.category = cat;
    // }
    // if (selectedSortBy) {
    //   parmas.sort_by = selectedSortBy;
    // }

    Api("get", url, "", router, parmas).then(
      (res) => {
        props.loader(false);
        SetProductList(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {t("Results for")}:
              <span className="text-black ml-2">"{router?.query?.cat_id}"</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {productList?.length} {t("products found")}
            </p>
          </div>
        </div>

        {productList?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {productList.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border shadow-sm  transition duration-300 w-[290px] flex-shrink-0"
              >
                <ProductCard
                  {...props}
                  item={item}
                  i={i}
                  url={`/product-detail/${item?.slug}?from=search`}
                />
              </div>
            ))}
          </div>
        ) : (
        
          <div className="flex flex-col items-center justify-center h-[450px] text-center bg-white rounded-xl border shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700">
              {t("No results found")}
            </h3>
            <p className="text-gray-500 mt-2">
              {t("Try searching with different keywords")}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {t("Search")}: "{router?.query?.cat_id}"
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Categories;
