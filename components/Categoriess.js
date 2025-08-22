import { Api } from '@/services/service';
import React, { useContext, useEffect, useState } from 'react'
import { MdNavigateNext } from "react-icons/md";
import { useRouter } from "next/router";
import { categoryContext, categoryListContext } from '@/pages/_app';
import { TbCategory } from "react-icons/tb";


function Categoriess(props) {
  console.log(props)
  const router = useRouter();
  const [categoryData, setCategoryData] = useState([]);
  const [categoryType, setCategoryType] = useContext(categoryContext);
  const [categoryList, SetCategoryList] = useContext(categoryListContext)

  useEffect(() => {
    getCategory()
  }, [])

  useEffect(() => {
    console.log(categoryType)
    getCategory()
  }, [categoryType])

  const getCategory = async () => {
    // props.loader(true);
    Api("get", `getCategory?type=${categoryType}`, "", router).then(
      (res) => {
        SetCategoryList([
          ...res.data]);
      },
      (err) => {
        // props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  return (
    <div className='w-full'>
      <div>
        {/* <p className="text-black text-lg	font-medium border-b border-custom-darkGray pb-5">My markets</p> */}

        <div className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { router.push(`/categories/all`); props.setShowCategory(false) }}>
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <TbCategory className="w-[25px] h-[25px] rounded-full text-black" />
            </div>
            <p className="text-black text-xs font-normal pl-3">All</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>

        {categoryList.map((item, i) => (<div key={i} className="flex justify-between items-center pt-5 cursor-pointer" onClick={() => { console.log(item.slug); router.push(`/categories/${item.slug}`); props.setShowCategory(false) }}>
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              {item?.name !== 'All' && <img className="w-[25px] h-[25px] rounded-full" src={item?.image} />}
              {item?.name === 'All' && <TbCategory className="w-[25px] h-[25px] rounded-full text-black" />}
            </div>
            <p className="text-black text-xs font-normal pl-3">{item?.name}</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>))}

        {/* <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <img className="w-[27px] h-[27px]" src="/apparel.png" />
            </div>
            <p className="text-black text-xs font-normal pl-3">Apparel</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <img className="w-[27px] h-[27px]" src="/vehicle-parts.png" />
            </div>
            <p className="text-black text-xs font-normal pl-3">Vehicle Parts & Accessories</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <img className="w-[27px] h-[27px]" src="/sports-entertainment.png" />
            </div>
            <p className="text-black text-xs font-normal pl-3">Sports & Entertainment</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <img className="w-[27px] h-[27px]" src="/machinery.png" />
            </div>
            <p className="text-black text-xs font-normal pl-3">Machinery</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <img className="w-[27px] h-[27px]" src="/home-garden.png" />
            </div>
            <p className="text-black text-xs font-normal pl-3">Home & Garden</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <img className="w-[27px] h-[27px]" src="/beauty-personal-care.png" />
            </div>
            <p className="text-black text-xs font-normal pl-3">Beauty & Personal Care</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div>

        <div className="flex justify-between items-center pt-3">
          <div className="flex justify-start items-center">
            <div className="bg-custom-lightGray w-[34px] h-[34px] rounded-full flex justify-center items-center">
              <img className="w-[21px] h-[21px]" src="/categories.png" />
            </div>
            <p className="text-black text-xs font-normal pl-3">All Categories</p>
          </div>
          <MdNavigateNext className="text-[#00000060] w-7 h-7" />
        </div> */}

      </div>


      {/* <div className='border-b border-custom-newLightGray'>
      <div className='flex justify-between items-center w-full  pb-5'>
        <p className='text-black text-lg font-bold'>Sort By</p>
        {!openData && <FaCircleChevronDown className='text-lg text-custom-gray' onClick={() => { setOpenData(true); console.log(showCategory) }} />}
        {openData && < FaCircleChevronUp className='text-lg text-custom-gray' onClick={() => setOpenData(false)} />}
      </div>
      {openData && <FormControl className=''>
        <FormGroup className='flex flex-col' >
          {sortByData.map((item, i) => (<FormControlLabel key={i}
            control={<Checkbox onChange={() => {
              setSelectedSortBy(item?.value)
            }} checked={item?.value === selectedSortBy} />}
            label={item?.name} />))}
        </FormGroup>
      </FormControl>}
    </div> */}

      {/* <div className='border-b border-custom-newLightGray w-full'>
      <div className='flex justify-between items-center w-full  py-5'>
        <p className='text-black text-lg font-bold'>Color</p>
        {!openColor && <FaCircleChevronDown className='text-lg text-custom-gray' onClick={() => { setOpenColor(true) }} />}
        {openColor && < FaCircleChevronUp className='text-lg text-custom-gray' onClick={() => setOpenColor(false)} />}
      </div>
      <div className='flex  justify-start items-start w-full gap-3 flex-wrap mb-3 '>
        {openColor && colorList?.map((item, i) => (<p key={i} className={`w-5 h-5  rounded-full border border-black  ${selectedColor.includes(item) && 'outline outline-offset-2 outline-2'}`} style={{ backgroundColor: item }}
          onClick={() => {
            if (!selectedColor.includes(item)) {
              selectedColor.push(item);
              setSelectedColor([...selectedColor])
            } else {
              const newData = selectedColor.filter(f => f !== item)
              setSelectedColor(newData)
            }
          }}
        ></p>))}
      </div>
    </div>

    <div className='border-b border-custom-newLightGray'>
      <div className='flex justify-between items-center w-full  py-5'>
        <p className='text-black text-lg font-bold'>Price</p>
        {!openPrice && <FaCircleChevronDown className='text-lg text-custom-gray' onClick={() => { setOpenPrice(true) }} />}
        {openPrice && < FaCircleChevronUp className='text-lg text-custom-gray' onClick={() => setOpenPrice(false)} />}
      </div>
      {openPrice && <FormControl className=''>
        <FormGroup className='flex flex-col' >
          {priceData.map((item, i) => (<FormControlLabel key={i}
            control={<Checkbox />}
            label={item?.name} />))}
        </FormGroup>
      </FormControl>}
    </div>

    <div className='border-b border-custom-newLightGray'>
      <div className='flex justify-between items-center w-full  py-5'>
        <p className='text-black text-lg font-bold'>Brand</p>
        {!openBrand && <FaCircleChevronDown className='text-lg text-custom-gray' onClick={() => { setOpenBrand(true) }} />}
        {openBrand && < FaCircleChevronUp className='text-lg text-custom-gray' onClick={() => setOpenBrand(false)} />}
      </div>
      {openBrand && <FormControl className=''>
        <FormGroup className='flex flex-col' >
          {brandData.map((item, i) => (<FormControlLabel key={i}
            control={<Checkbox />}
            label={item?.name} />))}
        </FormGroup>
      </FormControl>}
    </div>

    <div className='border-b border-custom-newLightGray'>
      <div className='flex justify-between items-center w-full  py-5'>
        <p className='text-black text-lg font-bold'>Gender</p>
        {!openGender && <FaCircleChevronDown className='text-lg text-custom-gray' onClick={() => { setOpenGender(true) }} />}
        {openGender && < FaCircleChevronUp className='text-lg text-custom-gray' onClick={() => setOpenGender(false)} />}
      </div>
      {openGender && <FormControl className=''>
        <FormGroup className='flex flex-col' >
          {genderData.map((item, i) => (<FormControlLabel key={i}
            control={<Checkbox />}
            label={item?.name} />))}
        </FormGroup>
      </FormControl>}
    </div> */}

      {/* <div className='mt-5 !z-50 fixed bottom-0  flex justify-center items-center'>
        <button className='bg-custom-red !w-[270px] h-[50px] rounded text-white text-lg font-bold flex justify-center items-center' >Apply</button>
      </div> */}

    </div>
  )
}

export default Categoriess
