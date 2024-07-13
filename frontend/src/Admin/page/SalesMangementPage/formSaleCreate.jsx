import React, { useEffect, useState } from "react";
import { DatePicker, Pagination } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import MultilevelDropdown from "../../components/MultilevelDropdown/MultilevelDropdown";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToChoosedList,
  removeProductFromChoosedList,
} from "../../../redux/slides/saleSlice";
import { DeleteOutlined } from "@ant-design/icons";

import TableComponent from "../../components/TableComponent/TableComponent";
import apiSales from "../../../services/saleApis";
import createAxiosInstance from "../../../services/createAxiosInstance";

const FormSaleCreate = ({
  registerCreate,
  control,
  errors,
  setValueCreate,
  navigate,
}) => {
  const { RangePicker } = DatePicker;

  const choosedProductList = useSelector(
    (state) => state.sale.createSale.choosedProduct
  );
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [categoryId, setCategoryId] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);

  const handleMenuItemClick = (id) => {
    setCategoryId(id);
  };

  const { data: productsToCreate, refetch: refetchProductsToCreate } = useQuery(
    {
      queryKey: [categoryId, pageNumber, "productsToCreate"],
      queryFn: () => {
        return apiSales.getProductByCateWithoutCreate(
          {
            category_id: categoryId ? categoryId : "",
            page_number: pageNumber,
          },
          auth?.accessToken,
          axiosJWT
        );
      },
    }
  );
  useEffect(() => {
    const data =
      productsToCreate?.contents?.length &&
      productsToCreate?.contents?.map((product) => {
        return { ...product, key: product.id };
      });

    setDataTable(data);
  }, [productsToCreate]);

  useEffect(() => {
    if (choosedProductList && choosedProductList.length > 0) {
      const productIds = choosedProductList.map((product) => product.id);
      setValueCreate("idProductList", productIds);
    } else {
      setValueCreate("idProductList", []);
    }
  }, [choosedProductList, setValueCreate]);

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const handleChosenRowClick = (key, record) => {
    dispatch(removeProductFromChoosedList(key));
  };

  const handleRowClick = async (key, record) => {
    dispatch(addProductToChoosedList(record));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Hình ảnh",
      dataIndex: "productImage",
      render: (productImage) => (
        <img
          src={productImage}
          alt="productImage"
          className="max-w-[50px] max-h-[50px]"
        />
      ),
    },
    {
      title: "Loại",
      dataIndex: "categoryName",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (text) => <p className="cursor-pointer">{text}</p>,
    },
    {
      title: "Tình trạng",
      dataIndex: "active",
      render: (active) => (
        <span
          className={`font-bold cursor-pointer ${
            active ? "text-green-500" : "text-red-500"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const columnsChoosed = [
    ...columns,
    {
      title: "Hành động",
      render: (text, record) => (
        <DeleteOutlined
          className="text-red-600 text-xl cursor-pointer hover:opacity-70"
          onClick={() => handleChosenRowClick(record.id, record)}
        />
      ),
    },
  ];

  const filterDataTable = () => {
    if (dataTable && dataTable?.length > 0) {
      return dataTable?.filter(
        (product) =>
          !choosedProductList?.some((choosed) => choosed.id === product.id)
      );
    }
  };

  const handleComeback = () => {
    navigate("/admin/sales");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <input
          type="text"
          placeholder="Tên mã khuyến mãi"
          {...registerCreate("name")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.name && (
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Mô tả"
          {...registerCreate("description")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.description && (
          <span className="text-red-600 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Tỉ lệ giảm giá"
          {...registerCreate("discountRate")}
          className="w-full p-3 mb-2 rounded border"
        />
        {errors.discountRate && (
          <span className="text-red-600 text-sm">
            {errors.discountRate.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Controller
          name="dateRange"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RangePicker
              className="w-full mb-2"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              value={
                value
                  ? [
                      dayjs(value[0], "DD/MM/YYYY 00:00:00"),
                      dayjs(value[1], "DD/MM/YYYY 00:00:00"),
                    ]
                  : [null, null]
              }
              format={"DD/MM/YYYY"}
              onChange={(dates, dateStrings) => {
                onChange(dateStrings);
              }}
            />
          )}
        />
        {errors.dateRange && (
          <span className="text-red-600 text-sm">
            {errors.dateRange.message}
          </span>
        )}
      </div>

      <MultilevelDropdown onMenuItemClick={handleMenuItemClick} />

      <div className="w-full">
        <p className="text-xl font-extrabold">Bảng sản phẩm</p>
        <TableComponent
          data={filterDataTable()}
          columns={columns}
          onRowClick={handleRowClick}
        />

        <div className="flex justify-center mt-4">
          <Pagination
            showSizeChanger={false}
            total={productsToCreate?.totalElements}
            pageSize={productsToCreate?.pageSize}
            onChange={onChange}
            current={pageNumber}
          />
        </div>
      </div>

      <div className="w-full">
        <p className="text-xl font-extrabold">Bảng sản phẩm đã chọn</p>
        <TableComponent data={choosedProductList} columns={columnsChoosed} />
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="cursor-pointer" onClick={handleComeback}>
          {"<"} Quay lại
        </p>
        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500">
          Tạo mã khuyến mãi
        </button>
      </div>
    </div>
  );
};

export default FormSaleCreate;
