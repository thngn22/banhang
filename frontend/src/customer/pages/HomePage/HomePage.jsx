import React from "react";
import HomeCarousel from "../../components/HomeCarousel/HomeCarousel";
import HomeSectionCarousel from "../../components/HomeSectionCarousel/HomeSectionCarousel";
import { tShirt } from "../../../Data/t-shirt";
import { jacket } from "../../../Data/jacket";

HomePage.propTypes = {};

function HomePage(props) {
  return (
    <div className="">
      <HomeCarousel />

      <div className="space-y-10 py-10 px-5 lg:px-10">
        <HomeSectionCarousel data={tShirt} />
        <HomeSectionCarousel data={jacket}/>
      </div>
      
    </div>
  );
}

export default HomePage;
