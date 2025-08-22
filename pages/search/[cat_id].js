import ProductCard from '@/components/ProductCard'
import React, { useEffect, useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MdNavigateNext } from "react-icons/md";
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { Api } from '@/services/service';
import { useRouter } from 'next/router';
import FormControl from '@mui/material/FormControl';
import { FaCircleChevronDown } from "react-icons/fa6";
import { FaCircleChevronUp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

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
    const [categoryList, SetCategoryList] = useState([])
    const [selectedCategories, setSelectedCategories] = useState('')
    const [selectedSortBy, setSelectedSortBy] = useState('')
    const [openData, setOpenData] = useState(false);
    const [openCategory, setOpenCategory] = useState(false)
    const { t } = useTranslation();

    useEffect(() => {
        if (router?.query?.cat_id) {
            productsearch(router?.query?.cat_id)
        }
    }, [router])

    useEffect(() => {
        getCategory()
    }, [])


    useEffect(() => {
        if (selectedCategories) {
            productsearch(router?.query?.cat_id, selectedCategories)
        }
    }, [selectedSortBy, selectedCategories])

    const productsearch = async (text, cat) => {
        let parmas = {}
        let url = `productsearch?key=${text}`

        if (cat) {
            parmas.category = cat
        }
        if (selectedSortBy) {
            parmas.sort_by = selectedSortBy
        }

        Api("get", url, "", router, parmas).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                SetProductList(res.data)
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const getCategory = async (cat) => {
        props.loader(true);
        Api("get", "getCategory", "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                res.data.push({
                    name: 'All',
                    slug: 'all'
                })
                SetCategoryList(res.data);

            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    const getproductByCategory = async (cat) => {
        props.loader(true);
        let parmas = {}
        let url = `getProductBycategoryId`
        if (cat) {
            parmas.category = cat
        }
        if (selectedSortBy) {
            parmas.sort_by = selectedSortBy
        }

        Api("get", url, "", router, parmas).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                SetProductList(res.data)
                // setShowCategory(false);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <div className="bg-white w-full">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="md:px-10 mx-auto w-full   px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <div className='grid md:grid-cols-4 grid-cols-1 w-full gap-5'>
                        {productList.map((item, i) => (
                            <div key={i} className='w-full'>
                                <ProductCard {...props} item={item} i={i} url={`/product-detail/${item?.slug}?from=categories`} />
                            </div>))}
                    </div>
                    {productList?.length === 0 && <p className="text-2xl text-black font-normal text-center flex justify-center items-center h-[500px]">{t("No Products")}</p>}
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
