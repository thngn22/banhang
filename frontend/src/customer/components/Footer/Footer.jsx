import React from "react";
// import { FaFacebook, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import logoVnPay from "../../../Data/image/vnpay-logo.jpg";

function Footer(props) {
  return (
    <footer className="bg-gray-200 px-6 py-8">
      <div className="w-full flex flex-col sm:flex-row justify-between mb-10">
        <div className="flex flex-col mb-4 sm:mb-0">
          <p className="ml-1 text-4xl font-extrabold text-gray-800">SHOES.CO</p>

          <div className="mt-4 text-center sm:text-left">
            <p className="text-sm text-gray-500">
              We have shoes that suits your style
            </p>
            <p className="text-sm text-gray-500">
              and which you are proud to wear.
            </p>
            <p className="text-sm text-gray-500">From women to men.</p>
            <p className="font-semibold text-gray-500 mt-4">
              Contact with us:{" "}
              <a
                href="https://github.com/thngn22/banhang"
                className="text-black underline"
              >
                github
              </a>
            </p>
          </div>
        </div>

        <div className="flex-1 sm:order-2 flex justify-end">
          <div className="flex w-full justify-end gap-52">
            <div className="flex flex-col items-start gap-2">
              <p className="font-medium uppercase tracking-widest">Company</p>
              <ul className="flex flex-col gap-2 text-gray-500">
                <li>About</li>
                <li>Features</li>
                <li>Works</li>
                <li>Careers</li>
              </ul>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-medium uppercase tracking-widest">Help</p>
              <ul className="flex flex-col gap-2 text-gray-500">
                <li>Customer Support</li>
                <li>Delivery Details</li>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-medium uppercase tracking-widest">FAQ</p>
              <ul className="flex flex-col gap-2 text-gray-500">
                <li>Account</li>
                <li>Manage Deliveries</li>
                <li>Orders</li>
                <li>Payments</li>
              </ul>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-medium uppercase tracking-widest">Resource</p>
              <ul className="flex flex-col gap-2 text-gray-500">
                <li>Ebooks</li>
                <li>How To - Blog</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-solid bg-gray-400 h-[1px] mt-4" />

      <div className="flex justify-between pt-4">
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          Shoes.co© 8/2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            nhthaqq7™ & roblnk™
          </a>
        </span>
        <div className="w-[4rem]">
          <img
            className="object-cover rounded-3xl"
            src={logoVnPay}
            alt="logoVnPay"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
