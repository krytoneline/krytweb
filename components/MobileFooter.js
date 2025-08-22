import React, { useContext } from 'react'
import { FiShoppingCart } from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { IoHomeOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { TbCategory } from "react-icons/tb";
import { categoryContext } from '@/pages/_app';
import { useTranslation } from "react-i18next";
import { IoBusiness } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";

function MobileFooter() {
    const router = useRouter();
    const [categoryType, setCategoryType] = useContext(categoryContext);
    const { t } = useTranslation();

    return (
        <div className='bg-white w-full h-14 grid grid-cols-5'>
            <div className='flex flex-col justify-center items-center'>
                <IoHomeOutline className='w-[20px] h-[20px] text-black' onClick={() => { router.push('/') }} />
                <p className='text-black font-normal text-xs'>Home</p>
            </div>
            {categoryType === 'Products' && <div className='flex flex-col justify-center items-center'>
                <IoBusiness className='w-[20px] h-[20px] text-black' onClick={() => { setCategoryType('Business'); }} />
                <p className='text-black font-normal text-xs'>Business</p>
            </div>}
            {categoryType === 'Business' && <div className='flex flex-col justify-center items-center'>
                <AiOutlineProduct className='w-[20px] h-[20px] text-black' onClick={() => { setCategoryType('Products'); }} />
                <p className='text-black font-normal text-xs'>Products</p>
            </div>}
            <div className='flex flex-col justify-center items-center'>
                <FiShoppingCart className='w-[20px] h-[20px] text-black' onClick={() => { router.push('/cart') }} />
                <p className='text-black font-normal text-xs'>Cart</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <TbCategory className='w-[20px] h-[20px] text-black' onClick={() => { router.push('/categoriesMobileView') }} />
                <p className='text-black font-normal text-xs'>Categories</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <CgProfile className='w-[20px] h-[20px] text-black' onClick={() => { router.push('/account') }} />
                <p className='text-black font-normal text-xs'>Account</p>
            </div>
        </div>
    )
}

export default MobileFooter
