import React from "react";
import HomeCarousel from "../../components/HomeCarousel/HomeCarousel";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import * as ProductService from "../../../services/ProductService";
import ProductCard from "../../components/Product/ProductCard";
import FooterHomePage from "../../components/CustomLayout/FooterHomePage";
import MultiCarousel from "../../components/MultiCarousel/MultiCarousel";

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

      <div className="py-10 px-20">
        {/* Smililer Products */}
        <section className="text-xl text-left ml-4 font-semibold">
          Sản phẩm bán được nhiều
        </section>
        <hr class="mb-2 ml-4 mr-4 mt-1 border-t border-gray-300" />
        <MultiCarousel homePage={true} />

        {/* High Rating Products */}
        <section className="text-xl text-left ml-4 font-semibold">
          Sản phẩm được đánh giá cao
        </section>
        <hr class=" mb-2 ml-4 mr-4 mt-1 border-t border-gray-300" />
        <MultiCarousel homePage={true} />
      </div>
      <FooterHomePage />
    </div>
  );
}

export default HomePage;
