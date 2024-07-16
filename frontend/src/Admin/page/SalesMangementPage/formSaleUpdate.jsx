import React, { useEffect, useState } from "react";
import { DatePicker, Pagination } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import MultilevelDropdown from "../../components/MultilevelDropdown/MultilevelDropdown";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductFromChoosedList_Update,
  detailSaleUpdate,
  removeProductFromChoosedList_Update,
} from "../../../redux/slides/saleSlice";
import { DeleteOutlined } from "@ant-design/icons";

import TableComponent from "../../components/TableComponent/TableComponent";
import createAxiosInstance from "../../../services/createAxiosInstance";
import apiSales from "../../../services/saleApis";
import { formatDayjs } from "../../../utils/untils";

const FormSaleUpdate = ({
  registerUpdate,
  control,
  errors,
  setValueUpdate,
  navigate,
  idSale,
  data,
}) => {
  const { RangePicker } = DatePicker;

  const auth = useSelector((state) => state.auth.login.currentUser);
  const detailSale = useSelector((state) => state.sale.updateSale.currentSale);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [categoryId, setCategoryId] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [time, setTime] = useState([data?.startDate, data?.endDate]);

  const handleMenuItemClick = (id, title) => {
    setCategoryId({ id, title });
  };

  const { data: productsToEdit } = useQuery({
    queryKey: [categoryId?.id, pageNumber, "productsToEdit"],
    queryFn: () => {
      return apiSales.getProductByCateWithoutEdit(
        {
          category_id: categoryId?.id ? categoryId?.id : "",
          page_number: pageNumber,
          sale_id: idSale,
        },
        auth?.accessToken,
        axiosJWT
      );
    },
  });
  useEffect(() => {
    const data =
      productsToEdit?.contents?.length &&
      productsToEdit?.contents?.map((product) => {
        return { ...product, key: product.id };
      });

    setDataTable(data);
  }, [productsToEdit]);

  useEffect(() => {
    if (detailSale && detailSale?.productResponses.length > 0) {
      const productIds = detailSale?.productResponses.map(
        (product) => product.id
      );
      setValueUpdate("idProductList", productIds);
    } else {
      setValueUpdate("idProductList", []);
    }
  }, [detailSale, setValueUpdate]);

  useEffect(() => {
    if (data) {
      setTime([data?.startDate, data?.endDate]);
      setValueUpdate("dateRange", [data?.startDate, data?.endDate]);
    }
  }, [data]);

  const onChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const handleChosenRowClick = (key, record) => {
    dispatch(removeProductFromChoosedList_Update(key));
  };

  const handleRowClick = async (key, record) => {
    dispatch(addProductFromChoosedList_Update(record));
  };

  const handleChangeTime = (value, onChange) => {
    const formattedValues = [];
    formattedValues.push(value[0] ? formatDayjs(value[0]) : "");
    formattedValues.push(value[1] ? formatDayjs(value[1]) : "");
    setTime(formattedValues);
    onChange(formattedValues);
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
          !detailSale.productResponses?.some(
            (choosed) => choosed.id === product.id
          )
      );
    }
  };

  const handleComeback = () => {
    dispatch(detailSaleUpdate(detailSale));
    navigate("/admin/sales");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <input
          type="text"
          placeholder="Tên mã khuyến mãi"
          defaultValue={data?.name}
          {...registerUpdate("name")}
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
          defaultValue={data?.description}
          {...registerUpdate("description")}
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
          defaultValue={data?.discountRate}
          {...registerUpdate("discountRate")}
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
              value={[
                time[0] ? dayjs(time[0], "DD-MM-YYYY HH:mm:ss") : null,
                time[1] ? dayjs(time[1], "DD-MM-YYYY HH:mm:ss") : null,
              ]}
              format={"DD/MM/YYYY"}
              onChange={(value) => handleChangeTime(value, onChange)}
            />
          )}
        />
        {errors.dateRange && (
          <span className="text-red-600 text-sm">
            {errors.dateRange.message}
          </span>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <MultilevelDropdown onMenuItemClick={handleMenuItemClick} />
        {categoryId && (
          <p className="font-medium">Danh mục {categoryId?.title}</p>
        )}
      </div>

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
            total={productsToEdit?.totalElements}
            pageSize={productsToEdit?.pageSize}
            onChange={onChange}
            current={pageNumber}
          />
        </div>
      </div>

      <div className="w-full">
        <p className="text-xl font-extrabold">Bảng sản phẩm đã chọn</p>
        <TableComponent
          data={detailSale?.productResponses}
          columns={columnsChoosed}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="cursor-pointer" onClick={handleComeback}>
          {"<"} Quay lại
        </p>
        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500">
          Cập nhật mã khuyến mãi
        </button>
      </div>
    </div>
  );
};

export default FormSaleUpdate;
