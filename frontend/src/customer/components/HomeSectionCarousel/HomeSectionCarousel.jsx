import React, { useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Button } from "@mui/material";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";



const HomeSectionCarousel = (props) => {
  const itemCard = props.data;

  const [activeIndex, setActiveIndex] = useState(0);

  const responsive = {
    0: { items: 1 },
    568: { items: 3 },
    1024: { items: 5 },
  };

  const slidePrev = () => setActiveIndex(activeIndex - 1);
  const slideNext = () => setActiveIndex(activeIndex + 1);

  const syncActiveIndex = (item) => setActiveIndex(item);

  const items = itemCard?.map((item) => <HomeSectionCard data={item} />);

  return (
    <div className="relative px-4 lg:px-8 border">
      <div className="relative p-5">
        <AliceCarousel
          items={items}
          disableButtonsControls
          responsive={responsive}
          disableDotsControls
          onSlideChange={syncActiveIndex}
          activeIndex={activeIndex}
        />

        {activeIndex !== 0 && (
          <Button
            variant="contained"
            className="z-50"
            onClick={slidePrev}
            sx={{
              position: "absolute",
              left: "0rem",
              top: "9.5rem",
              transform: "translateX(-100%) rotate(90deg)",
              bgcolor: "white",
              transition: "opacity 0.3s",
              "&:hover": {
                bgcolor: "white",
                opacity: 0.5,
              },
            }}
            aria-label="next"
          >
            <KeyboardArrowLeftIcon
              sx={{ transform: "rotate(-90deg)", color: "black" }}
            />
          </Button>
        )}

        {activeIndex !== items?.length - 5 && (
          <Button
            variant="contained"
            className="z-50"
            onClick={slideNext}
            sx={{
              position: "absolute",
              right: "0rem",
              top: "9.5rem",
              transform: "translateX(100%) rotate(90deg)",
              bgcolor: "white",
              transition: "opacity 0.3s",
              "&:hover": {
                bgcolor: "white",
                opacity: 0.5,
              },
            }}
            aria-label="next"
          >
            <KeyboardArrowLeftIcon
              sx={{ transform: "rotate(90deg)", color: "black" }}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeSectionCarousel;
