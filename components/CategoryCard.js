import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

function CategoryCard({ item, i }) {
  const router = useRouter();
  return (
    <div
      className="rounded-lg md:h-56 w-full flex flex-col items-center justify-center cursor-pointer 
 transition hover:scale-105"
      onClick={()=> router.push(`/categories/${item.slug}`)}
      key={i}
    >
      <div className="relative w-32 h-32 ">
        <Image
          src={item?.image}
          alt={item?.name}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-base font-semibold text-gray-800 text-center">
        {item?.name}
      </h3>
    </div>
  );
}

export default CategoryCard;
