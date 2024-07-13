import React from "react";
import HomeCarousel from "../../components/HomeCarousel/HomeCarousel";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../../services/ProductService";
import FooterHomePage from "../../components/CustomLayout/FooterHomePage";
import MultiCarousel from "../../components/MultiCarousel/MultiCarousel";
import CategoryMenu from "../../components/CategoryMenu/CategoryMenu";

HomePage.propTypes = {};

function HomePage(props) {
  const { data: topRating } = useQuery({
    queryKey: ["topRating"],
    queryFn: () => {
      return ProductService.getProductTopRatingHome();
    },
  });
  const { data: topSold } = useQuery({
    queryKey: ["topSold"],
    queryFn: () => {
      return ProductService.getProductTopSoldHome();
    },
  });

  return (
    <div>
      <HomeCarousel />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <CategoryMenu />
        <hr className="border bg-gray-400 mx-5 my-10" />

        <p className="text-4xl text-center font-extrabold pt-10 pb-6 uppercase">
          Những sản phẩm bán được nhiều
        </p>
        <MultiCarousel homePage={true} dataCarousel={topSold} />
        <hr className="border bg-gray-400 mx-5 my-10" />

        <p className="text-4xl text-center font-extrabold pt-10 pb-6 uppercase">
          Những sản phẩm được đánh giá cao
        </p>
        <MultiCarousel homePage={true} dataCarousel={topRating} />
      </div>

      <FooterHomePage />
    </div>
  );
}

export default HomePage;
