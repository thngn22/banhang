import React from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";

const Cart = () => {
  return (
    <div className="lg:grid grid-cols-3 lg:px-16 relative">
      <div className="col-span-2">
        {[1, 1, 1, 1].map((item) => (
          <CartItem />
        ))}
      </div>

      <div className="px-5 top-0 h-[100vh] mt-5 lg:mt-0">
        <div className="border">
          <p className="uppercase font-bold opacity-60 pb-4">price detail</p>
          <hr />

          <div className="space-y-3 font-semibold">
            <div className="flex justify-between pt-3 text-black">
              <span>Price</span>
              <span>123đ</span>
            </div>

            <div className="flex justify-between pt-3 text-black">
              <span>Disscount</span>
              <span className="text-green-600">123đ</span>
            </div>

            <div className="flex justify-between pt-3 text-black">
              <span>Delivery Charge</span>
              <span className="text-green-600">123đ</span>
            </div>

            <div className="flex justify-between pt-3 font-bold">
              <span>Total Amount</span>
              <span className="text-green-600">123đ</span>
            </div>
          </div>

          <Button
            variant="contained"
            className="w-full mt-5"
            sx={{ px: "2.5rem", py: ".7rem", bgcolor: "#9155fd" }}
          >
            checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
