import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as CategoryService from "../../../services/CategoryService";

import logosubCate from "../../../Data/image/sandal.svg";

const CategoryMenu = () => {
  const [listCategories, setListCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchAllCategory = async () => {
      const res = await CategoryService.getAllTreeCategory();
      setListCategories(res);
    };
    fetchAllCategory();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null); // Đóng danh mục nếu nó đang mở
    } else {
      setActiveCategory(categoryId); // Mở danh mục đã nhấp
    }
  };

  return (
    <section className="my-8">
      <div className="flex flex-wrap justify-center gap-4">
        {listCategories.map((listCategory) => (
          <div key={listCategory.id}>
            <h2
              className={`cursor-pointer text-xl font-bold my-2 px-4 py-2 rounded transition duration-200 ease-in-out ${
                activeCategory === listCategory.id
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => handleCategoryClick(listCategory.id)}
            >
              {listCategory.name}
            </h2>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {listCategories.map((listCategory) =>
          activeCategory === listCategory.id ? (
            <div
              key={listCategory.id}
              className="flex flex-wrap justify-center gap-4 mt-2"
            >
              {listCategory.categories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  className="flex flex-col items-center text-center"
                  style={{ width: "100px" }} // Set fixed width for each sub-category
                >
                  <Link
                    to={`/products/category/${
                      subCategory.id
                    }/${encodeURIComponent(subCategory.name)}`}
                  >
                    <div className="mb-2 bg-gray-200 rounded-full ">
                      <img
                        src={logosubCate}
                        alt="logoSubcate"
                        className="w-full object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm font-medium">{subCategory.name}</p>
                  </Link>
                </div>
              ))}
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

export default CategoryMenu;
