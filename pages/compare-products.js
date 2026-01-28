import React, { useContext, useEffect, useState } from "react";
import { cartCompareContext } from "./_app";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useRouter } from "next/router";
import constant from "@/services/constant";

function CompareProducts() {
  const router = useRouter();
  const [cartCompareData, setCartCompareData] = useContext(cartCompareContext);
  const [attributesList, setAttributesList] = useState([]);

  useEffect(() => {
    let attrlist = [];
    if (cartCompareData.length > 1) {
      cartCompareData.forEach((item, i) => {
        item.attributes.forEach((ele) => {
          let aatr = attrlist?.find((f) => f.name === ele.name);
          console.log(aatr);
          if (aatr) {
            aatr[ele.name][i] = ele?.value || "-";
          } else {
            const newA = [...Array(cartCompareData.length)].map((x) => "-");
            newA[i] = ele?.value || "-";
            attrlist = [...attrlist, { name: ele.name, [ele.name]: newA }];
          }
        });
      });
      setAttributesList(attrlist);
    } else {
      router.replace("/");
    }
  }, [cartCompareData]);

  return (
    <div className="md:py-10 py-5 mx-auto w-full md:px-0 max-w-7xl min-h-[550px]">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell className="min-w-60 border border-r-custom-lightGray"></TableCell>
              {cartCompareData?.map((item, i) => (
                <TableCell
                  key={i}
                  className=" border border-r-custom-lightGray"
                >
                  <div className="flex bg-white">
                    <div className="flex gap-2 p-2 relative h-max min-w-60">
                      <div className=" text-white cursor-pointer bg-black rounded-full p-1 absolute top-0 left-0 text-xl">
                        <IoIosCloseCircleOutline
                          onClick={() => {
                            let d = cartCompareData;
                            let c = d.filter((f) => f._id !== item?._id);
                            setCartCompareData([...c]);
                            localStorage.setItem(
                              "addCartCompare",
                              JSON.stringify(c),
                            );
                          }}
                        />
                      </div>
                      <div className="h-32 w-32 flex justify-center items-center">
                        <img
                          className="object-cover"
                          src={item?.varients[0]?.image[0]}
                          height={"100%"}
                          width={"100%"}
                        />
                      </div>
                      <div>
                        <p className="text-black text-sm">{item?.name}</p>
                        <p className="text-black text-sm font-bold">
                          {constant?.currency}
                          {item?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {attributesList.map((row, i) => (
              <TableRow key={i}>
                <TableCell
                  component="th"
                  scope="row"
                  className="!text-white p-3 border border-r-custom-lightGray"
                  style={{
                    background:
                      "linear-gradient(132.11deg, rgba(0, 0, 0, 0.5) 1.72%, rgba(102, 102, 102, 0.5) 98.28%)",
                  }}
                >
                  {row.name}
                </TableCell>

                {Object.keys(row[row.name]).map((item, inx) => (
                  <TableCell
                    key={inx}
                    component="th"
                    scope="row"
                    className=" border border-r-custom-lightGray"
                  >
                    {row[row.name][inx]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CompareProducts;
