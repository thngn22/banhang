import React, { useState } from "react";
import HomeCarousel from "../../components/HomeCarousel/HomeCarousel";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../../services/ProductService";
import FooterHomePage from "../../components/CustomLayout/FooterHomePage";
import MultiCarousel from "../../components/MultiCarousel/MultiCarousel";
import CategoryMenu from "../../components/CategoryMenu/CategoryMenu";
import { useDispatch, useSelector } from "react-redux";
import createAxiosInstance from "../../../services/createAxiosInstance";
import { Pagination } from "antd";
import ProductCard from "../../components/Product/ProductCard";

HomePage.propTypes = {};

function HomePage(props) {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);

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

  const { data: productsRS } = useQuery({
    queryKey: [pageNumber],
    queryFn: () => {
      return ProductService.getProductsRS(
        {
          page_number: pageNumber,
        },
        auth.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  return (
    <div>
      <HomeCarousel />

      <div className="px-8 py-8">
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

        {auth && (
          <div className="">
            <hr className="border bg-gray-400 mx-5 my-10" />
            <p className="text-4xl text-center font-extrabold pt-10 pb-6 uppercase">
              Những sản phẩm có thể bạn thích
            </p>
            <div className="grid grid-cols-4 justify-items-center">
              {productsRS &&
                productsRS.contents.map((product, index) => (
                  <div key={index} className="group relative w-[16rem]">
                    <ProductCard data={product} />
                  </div>
                ))}
            </div>
            <div className="flex justify-center mt-2">
              {productsRS && (
                <Pagination
                  total={productsRS?.totalElements}
                  pageSize={productsRS?.pageSize}
                  defaultCurrent={pageNumber}
                  showSizeChanger={false}
                  onChange={onChange}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <FooterHomePage />
    </div>
  );
}

export default HomePage;
