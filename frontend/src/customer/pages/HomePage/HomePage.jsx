import React from "react";
import HomeCarousel from "../../components/HomeCarousel/HomeCarousel";
import HomeSectionCarousel from "../../components/HomeSectionCarousel/HomeSectionCarousel";
import { tShirt } from "../../../Data/t-shirt";
import { jacket } from "../../../Data/jacket";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import * as ProductService from "../../../services/ProductService";
import ProductCard from "../../components/Product/ProductCard";

HomePage.propTypes = {};

function HomePage(props) {
  // const fetchProductAll = async () => {
  //   const res = await ProductService.getAllProduct();
  //   return res;
  // };

  // // const data = fetchProductAll()
  // // console.log(data);

  // const { data: products, isSuccess } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: () => fetchProductAll(),
  // });

  return (
    <div className="">
      <HomeCarousel />

      <div className="space-y-10 py-10 px-5 lg:px-10">
        {/* {isSuccess && (
          <>
            <ProductCard data={products} />
            <ProductCard data={products} />
            <ProductCard data={products} />
            <ProductCard data={products} />
          </>
        )} */}

        {/* <ProductCard data={products} /> */}
        {/* <ProductCard data={products} />
         <ProductCard data={products} />
         <ProductCard data={products} />
         <ProductCard data={products} /> */}
        {/* <HomeSectionCarousel data={tShirt} />
        <HomeSectionCarousel data={jacket}/>  */}
      </div>
    </div>
  );
}

export default HomePage;
