import ProductCard from '@/components/ProductCard'
import React, { useContext, useEffect, useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { Api } from '@/services/service';
import { useRouter } from 'next/router';
import FormControl from '@mui/material/FormControl';
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaCircleChevronUp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { categoryContext, categoryListContext } from '../_app';

const limit = 6

const sortByData = [
    {
        name: 'Featured',
        value: 'featured'
    },
    {
        name: 'Best selling',
        value: 'is_top'
    },
    {
        name: 'Alphabetically, A-Z',
        value: 'a_z'
    },
    {
        name: 'Alphabetically, Z-A',
        value: 'z_a'
    },
    {
        name: 'Price, low to high',
        value: 'low'
    },
    {
        name: 'Price, high to low',
        value: 'high'
    },
    {
        name: 'Date, old to new',
        value: 'old'
    },
    {
        name: 'Date, new to old',
        value: 'new'
    },
]

function Categories(props) {
    const router = useRouter()
    console.log(router)
    const [productList, SetProductList] = useState([])
    const [category, setCategory] = useState({})
    const [categoryList, SetCategoryList] = useContext(categoryListContext)
    const [selectedCategories, setSelectedCategories] = useState('')
    const [selectedSortBy, setSelectedSortBy] = useState('')
    const [openData, setOpenData] = useState(false);
    const [openCategory, setOpenCategory] = useState(true)
    const { t } = useTranslation();
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [categoryType, setCategoryType] = useContext(categoryContext);

    useEffect(() => {
        SetProductList([])
        getproductByCategory(router?.query?.cat_id, 1)
        setSelectedCategories(router?.query?.cat_id)
    }, [router])

    useEffect(() => {
        getCategory()
    }, [])

    useEffect(() => {
        getCategory()
    }, [categoryType])

    useEffect(() => {
        if (selectedCategories) {
            getproductByCategory(selectedCategories, 1)
        }
    }, [selectedSortBy])

    useEffect(() => {
        if (router?.query?.cat_id) {
            router.replace(`/categories/${router?.query?.cat_id}`)
            setSelectedCategories(router?.query?.cat_id)
        }
    }, [categoryType])

    const getCategory = async (cat) => {
        // props.loader(true);
        Api("get", `getCategory?type=${categoryType}`, "", router).then(
            (res) => {
                // props.loader(false);
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

    const getproductByCategory = async (cat, p) => {
        props.loader(true);
        let parmas = {}
        let url = `getProductBycategoryId`
        parmas.page = p
        parmas.limit = limit
        if (cat) {
            parmas.category = cat
        }
        parmas.type = categoryType;
        if (selectedSortBy) {
            parmas.sort_by = selectedSortBy
        }
        Api("get", url, "", router, parmas).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (p === 1) {
                    SetProductList(res.data)
                } else {
                    SetProductList([...productList, ...res.data])
                }

                if (res.data.length < limit) {
                    setHasMore(false)
                    setPage(1)
                } else {
                    setHasMore(true)
                    setPage(p + 1)
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <div className="bg-white w-full ">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="md:px-10 mx-auto w-full z-30 px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <div className='grid md:grid-cols-4 grid-cols-1 w-full md:gap-5'>

                        <div className='bg-custom-lightGrayColors w-full px-5 py-5'>

                            <div className='border-b border-custom-newLightGra'>
                                <div className='flex justify-between items-center w-full  pb-5'>
                                    <p className='text-custom-darkBlack font-semibold text-lg'>{t("Sort By")}</p>
                                    {!openData && <FaCircleChevronDown className='text-lg text-custom-newDarkGray' onClick={() => { setOpenData(true); }} />}
                                    {openData && < FaCircleChevronUp className='text-lg text-custom-newDarkGray' onClick={() => setOpenData(false)} />}
                                </div>
                                {openData && <FormControl className=''>
                                    <FormGroup className='flex flex-col' >
                                        {sortByData.map((item, i) => (<FormControlLabel className='text-black' key={i}
                                            control={
                                                <Checkbox onChange={() => {
                                                    if (selectedSortBy === item?.value) {
                                                        SetProductList([])
                                                        setSelectedSortBy('')
                                                    } else {
                                                        SetProductList([])
                                                        setSelectedSortBy(item?.value)
                                                    }
                                                }}
                                                    checked={item?.value === selectedSortBy}
                                                />}
                                            label={item?.name} />))}
                                    </FormGroup>
                                </FormControl>}
                            </div>

                            <div className='pt-5'>
                                <div className='flex justify-between items-center w-full  pb-5'>
                                    <p className='text-custom-darkBlack font-semibold text-lg'>{t("Categories")}</p>
                                    {!openCategory && <FaCircleChevronDown className='text-lg text-custom-newDarkGray' onClick={() => { setOpenCategory(true); }} />}
                                    {openCategory && < FaCircleChevronUp className='text-lg text-custom-newDarkGray' onClick={() => setOpenCategory(false)} />}
                                </div>

                                {openCategory && <FormGroup>
                                    <FormControlLabel className='text-black' control={<Checkbox
                                        onChange={() => {
                                            SetProductList([])
                                            router.replace(`/categories/all`)
                                            setSelectedCategories('all')
                                        }}
                                        checked={'all' === selectedCategories}
                                    />} label='All' />

                                    {categoryList.map((item, i) => (<FormControlLabel className='text-black' key={i} control={<Checkbox
                                        onChange={() => {
                                            SetProductList([])
                                            router.replace(`/categories/${item.slug}`)
                                            setSelectedCategories(item?.slug)
                                        }}
                                        checked={item.slug === selectedCategories}
                                    />} label={item?.name} />))}
                                </FormGroup>}
                            </div>
                        </div>

                        <div className='col-span-3 !z-40'>
                            <div className=' md:mt-0 mt-5 !z-20'>
                                {/* <InfiniteScroll
                                    dataLength={productList.length}
                                    next={() => { getproductByCategory(router?.query?.cat_id, page) }}
                                    hasMore={hasMore}
                                > */}
                                <div className="grid md:grid-cols-3 grid-cols-1 gap-5 !z-20">
                                    {productList.map((item, i) => (
                                        <div key={i} className='w-full !z-30'>
                                            <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}?from=categories`} />
                                        </div>))}
                                </div>
                                {/* </InfiniteScroll> */}

                                {productList?.length === 0 && <div className='w-full md:h-[500px] h-[200px] flex justify-center items-center'>
                                    <p className="text-2xl text-black font-normal text-center">{t("No Products")}</p>
                                </div>}
                            </div>
                        </div>

                    </div>

                    {/* <div className='pt-5 flex justify-end items-end'>
                        <Stack spacing={2}>
                            <Pagination count={10} shape="rounded" size="small" />
                        </Stack>
                    </div> */}
                </div>
            </section>

        </div>
    )
}

export default Categories
