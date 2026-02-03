import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cartCompareContext, cartContext, categoryContext } from "@/pages/_app";
import { MdHighQuality } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { Api } from "@/services/service";
import { useTranslation } from "react-i18next";
import constant from "@/services/constant";
import { IoRemoveSharp } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { produce } from "immer";

function ProductCard({ item, i, url, section, toaster }) {
  const router = useRouter();
  const [cartData, setCartData] = useContext(cartContext);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cartCompareData, setCartCompareData] = useContext(cartCompareContext);
  const { t } = useTranslation();
  const [categoryType, setCategoryType] = useContext(categoryContext);

  useEffect(() => {
    // console.log(cartData)
    const index = cartData.findIndex((f) => f._id === item?._id);
    console.log(index);
    setSelectedIndex(index);
  }, [cartData]);

  const sponsoredProduct = async () => {
    if (section) {
      charngeCPC();
    } else {
      router.push(url);
    }
  };

  const charngeCPC = () => {
    let data = {
      seller: item?.userid,
    };
    Api("post", "chargeCPC", data, router).then(
      (res) => {
        // console.log("res================>", res);
        if (res.status) {
          router.push(url);
        }
      },
      (err) => {
        console.log(err);
      },
    );
  };

  const handleCompareToggle = (item) => {
    localStorage.setItem("CompareClose", "open");

    let data = cartCompareData ? [...cartCompareData] : [];

    const alreadyAdded = data.find((f) => f._id === item?._id);
    const sameCategoryItem = data.find(
      (f) => f.category?._id === item?.category?._id,
    );

    // ADD ITEM
    if (!alreadyAdded) {
      if (data.length === 0 || sameCategoryItem) {
        const newItem = {
          ...item,
          total: item.price,
          qty: 1,
        };

        const updatedData = [...data, newItem];
        setCartCompareData(updatedData);
        localStorage.setItem("addCartCompare", JSON.stringify(updatedData));
      } else {
        toaster({
          type: "error",
          message: "You can not add different category in the comparison",
        });
      }
    } else {
      const updatedData = data.filter((f) => f._id !== item?._id);
      setCartCompareData(updatedData);
      localStorage.setItem("addCartCompare", JSON.stringify(updatedData));
    }
  };

  const handleDecreaseQty = (index) => {
    if (index === -1) return;

    const currentItem = cartData[index];

    // Qty > 1 → just decrease
    if (currentItem.qty > 1) {
      const nextState = produce(cartData, (draft) => {
        draft[index].qty -= 1;
        draft[index].total = (draft[index].price * draft[index].qty).toFixed(2);
      });

      setCartData(nextState);
      localStorage.setItem("addCartDetail", JSON.stringify(nextState));
    }
    // Qty === 1 → remove item
    else {
      const nextState = produce(cartData, (draft) => {
        draft.splice(index, 1);
      });

      setSelectedIndex(-1);

      if (nextState.length > 0) {
        setCartData(nextState);
        localStorage.setItem("addCartDetail", JSON.stringify(nextState));
      } else {
        setCartData([]);
        localStorage.removeItem("addCartDetail");
      }
    }
  };

  const handleIncreaseQty = (index) => {
    if (index === -1) return;

    const nextState = produce(cartData, (draft) => {
      draft[index].qty += 1;
      draft[index].total = (draft[index].price * draft[index].qty).toFixed(2);
    });

    setCartData(nextState);
    localStorage.setItem("addCartDetail", JSON.stringify(nextState));
  };

  const handleAddToCart = (item) => {
    let data = cartData?.length > 0 ? [...cartData] : [];

    const existingItem = data.find(
      (f) =>
        f._id === item?._id &&
        f.selectedColor?.color === item?.varients?.[0]?.color,
    );

    // ADD NEW ITEM
    if (!existingItem) {
      let newItem = {
        ...item,
        qty: 1,
        total: item.price,
        image: item?.varients?.[0]?.image?.[0],
      };

      if (item?.varients?.[0]?.color) {
        newItem.selectedColor = item.varients[0].color;
      }

      const nextState = produce(cartData, (draft) => {
        draft.push(newItem);
      });

      setCartData(nextState);

      const index = nextState.findIndex(
        (f) =>
          f._id === item?._id &&
          f.selectedColor?.color === newItem.selectedColor,
      );

      setSelectedIndex(index);

      localStorage.setItem("addCartDetail", JSON.stringify(nextState));
    }
    // UPDATE QTY
    else {
      const nextState = produce(cartData, (draft) => {
        const index = draft.findIndex(
          (f) =>
            f._id === item?._id &&
            f.selectedColor?.color === existingItem.selectedColor,
        );

        if (index !== -1) {
          draft[index].qty += productsId.qty;
          draft[index].total = draft[index].price * draft[index].qty;
        }
      });

      setCartData(nextState);
      localStorage.setItem("addCartDetail", JSON.stringify(nextState));
    }
  };

  return (
    <div className="bg-[#F9F9F9] rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className=" md:h-[300px] h-40 flex items-center justify-center cursor-pointer">
        <img
          src={item?.varients[0]?.image[0]}
          alt={item?.name}
          className="object-contain h-full w-full"
          onClick={sponsoredProduct}
        />
      </div>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <p
            className="text-[18px] font-medium text-black line-clamp-2 cursor-pointer"
            onClick={sponsoredProduct}
          >
            {item?.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={star <= 4 ? "#FACC15" : "#E5E7EB"} // yellow & gray
                className="w-4 h-4"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.016 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
              </svg>
            ))}

            {/* <span className="text-sm font-medium text-gray-600 ml-1">4.5</span> */}
          </div>
        </div>

        <div className="flex gap-1">
          {item?.is_verified && (
            <MdVerified className="text-lg text-green-700" />
          )}
          {item?.is_quality && (
            <MdHighQuality className="text-lg text-red-600" />
          )}
        </div>

        {categoryType === "Products" && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#D75300]">
                {constant?.currency}
                {item?.price}
              </span>
              <del className="text-[15px] text-gray-400">
                {constant?.currency}
                {item?.offer}
              </del>
            </div>
            {selectedIndex === -1 ? (
              <button
                onClick={() => handleAddToCart(item)}
                className="px-4 mt-2 py-2 text-[14px] font-semibold rounded-[8px] border border-gray-300 hover:bg-gray-800 bg-black hover:text-white transition"
              >
                {t("ADD TO CART")}
              </button>
            ) : (
              <div className="flex justify-between items-center mt-2 border rounded-xl px-2 py-1">
                <button
                  className=" flex justify-center items-centerp px-2"
                  onClick={() => handleDecreaseQty(selectedIndex)}
                >
                  <IoRemoveSharp className="h-[15px] w-[15px] text-black" />
                </button>
                <span className="font-medium text-black">
                  {cartData[selectedIndex]?.qty}
                </span>
                <button
                  className="flex justify-center items-center px-2"
                  onClick={() => handleIncreaseQty(selectedIndex)}
                >
                  <IoAddSharp className="h-[15px] w-[15px] text-black" />
                </button>
              </div>
            )}
          </div>
        )}

        <label className="flex items-center gap-3 pt-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-black h-4 w-4"
            checked={cartCompareData.map((d) => d._id).includes(item._id)}
            onClick={() => handleCompareToggle(item)}
          />
          <span className="text-sm text-black font-medium">{t("Add to Compare")}</span>
        </label>
      </div>
    </div>
  );
}

export default ProductCard;
