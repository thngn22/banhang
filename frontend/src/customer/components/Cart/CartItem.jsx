import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const CartItem = () => {
  return (
    <div className="p-5 shadow-lg border rounded-md mb-5">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            className="w-full h-full object-cover object-top"
            src="https://bizweb.dktcdn.net/100/415/697/products/te8544-wvs9s70f-1-rn3o-hinh-mat-sau-0-1.jpg?v=1692001059523"
            alt="https://bizweb.dktcdn.net/100/415/697/products/te8544-wvs9s70f-1-rn3o-hinh-mat-sau-0-1.jpg?v=1692001059523"
          />
        </div>
        <div className="ml-5 space-y-1">
          <p className="font-semibold">Windbreaker Black White AK077</p>
          <p className="opavity-70">Size: L, Color: White</p>
          <p className="opacity-70 mt-2">Local Brand Teelab Studio</p>

          <div className="flex items-center justify-center space-x-5 text-gray-900 pt-6">
            <p className="font-semibold">150.000đ</p>
            <p className="line-through opacity-50">250.000đ</p>
            <p className="text-green-600 font-semibold">-40%</p>
          </div>
        </div>
      </div>
      <div className="lg:flex items-center lg:space-x-10 pt-4">
        <div className="flex items-center space-x-2">
          <IconButton>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <span className="py-1 px-7 border rounded-sm">3</span>
          <IconButton sx={{ color: "RGB(145,85,253)" }}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>

        <div className="">
          <Button sx={{ color: "RGB(220,20,60)", fontWeight: "bold" }}>
            remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
