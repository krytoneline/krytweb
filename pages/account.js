import React, { useContext, useState } from 'react'
import { useRouter } from "next/router";
import { userContext } from './_app';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { PiSignOutFill } from 'react-icons/pi'
import { useTranslation } from "react-i18next";
import ConfirmationModal from '@/components/ConfirmationModel';
import { MdNavigateNext } from 'react-icons/md';
import { FaRegUserCircle } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";



function Account() {
    const router = useRouter();
    const [user, setUser] = useContext(userContext);
    const { t } = useTranslation();
    const [signOutModel, setSignOutModel] = useState(false);

    const logOut = () => {
        setUser({});
        localStorage.removeItem('userDetail');
        localStorage.removeItem('token');
        router.push('/auth/signIn')
    }

    return (
        <div className='w-full p-5'>
            {/* <div className='flex justify-start items-center gap-5'>
                {user?.username && <div className='bg-custom-gray h-[40px] w-[40px] rounded-full flex justify-center items-center' onClick={() => { setSignOutModel(true) }}>
                    <p className="font-bold text-white text-base text-center capitalize">
                        {user?.username
                            ?.charAt(0)
                            .toUpperCase()}
                    </p>
                </div>}
                {!user?.username && <button className='bg-custom-red rounded-[20px] h-[40px] w-[180px] text-white text-base font-normal' onClick={() => { router.push('/auth/signIn') }}>{t("Sign in or Register")}</button>}
                {user?.username && <div className='w-[40px] h-[40px] bg-custom-gray rounded-full flex justify-center items-center' onClick={() => { router.push('/favourite') }}>
                    <FaRegHeart className='text-white w-[23px] h-[23px]' />
                </div>}
             
            </div> */}

            {user?.username && <div className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { router.push('/profile') }}>
                <div className="flex justify-start items-center">
                    <div className="bg-custom-lightGray w-[40px] h-[40px] rounded-full flex justify-center items-center">
                        <div className='bg-custom-gray h-[40px] w-[40px] rounded-full flex justify-center items-center' >
                            <p className="font-bold text-white text-base text-center capitalize">
                                {user?.username
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <p className="text-black text-xs font-normal pl-3">{user?.username}</p>
                </div>
                <MdNavigateNext className="text-[#00000060] w-7 h-7" />
            </div>}
            {!user?.username && <div className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { router.push('/auth/signIn') }}>
                <div className="flex justify-start items-center">
                    <div className="bg-custom-lightGray w-[40px] h-[40px] rounded-full flex justify-center items-center">
                        <div className='bg-custom-gray h-[40px] w-[40px] rounded-full flex justify-center items-center' >
                            <FaRegUserCircle className='text-white w-[23px] h-[23px]' />
                        </div>
                    </div>
                    <p className="text-black text-xs font-normal pl-3">{t("Sign in or Register")}</p>
                </div>
                <MdNavigateNext className="text-[#00000060] w-7 h-7" />
            </div>}

            {user?.username && <div className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { router.push('/favourite') }}>
                <div className="flex justify-start items-center">
                    <div className="bg-custom-lightGray w-[40px] h-[40px] rounded-full flex justify-center items-center">
                        <div className='w-[40px] h-[40px] bg-custom-gray rounded-full flex justify-center items-center' >
                            <FaRegHeart className='text-white w-[23px] h-[23px]' />
                            {/* <FaHeart className='text-red-700 w-[23px] h-[23px]' /> */}
                        </div>

                    </div>
                    <p className="text-black text-xs font-normal pl-3">{t("My Favourite")}</p>
                </div>
                <MdNavigateNext className="text-[#00000060] w-7 h-7" />
            </div>}

            {user?.username && <div className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { setSignOutModel(true) }}>
                <div className="flex justify-start items-center">
                    <div className="bg-custom-lightGray w-[40px] h-[40px] rounded-full flex justify-center items-center">
                        <div className='w-[40px] h-[40px] bg-custom-gray rounded-full flex justify-center items-center' >
                            <VscSignOut className='text-white w-[23px] h-[23px]' />
                            {/* <FaHeart className='text-red-700 w-[23px] h-[23px]' /> */}
                        </div>

                    </div>
                    <p className="text-black text-xs font-normal pl-3"> {t("Sign out")}</p>
                </div>
                <MdNavigateNext className="text-[#00000060] w-7 h-7" />
            </div>}

            <ConfirmationModal open={signOutModel} onClose={() => { setSignOutModel(false) }} onConfirm={() => {
                setUser({})
                // setShowHover(false);
                localStorage.removeItem(
                    "userDetail"
                );
                setSignOutModel(false)
                localStorage.removeItem("token");
                router.push('/auth/signIn')
            }}
                title='Are you sure?'
                description='Do you want to signout?'
            />
        </div>
    )
}

export default Account
