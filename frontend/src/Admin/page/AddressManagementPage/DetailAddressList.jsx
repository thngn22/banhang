import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../../components/TableComponent/TableComponent";
import { Pagination } from "antd";
import { useQuery } from "@tanstack/react-query";
import apiAddresses from "../../../services/addressApis.js";
import createAxiosInstance from "../../../services/createAxiosInstance.js";

const DetailAddressList = ({ idUser }) => {
  const auth = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const axiosJWT = createAxiosInstance(auth, dispatch);
  const [dataTable, setDataTable] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const { data: addressList } = useQuery({
    queryKey: [idUser, pageNumber],
    queryFn: () => {
      return apiAddresses.getAddressByUserAdmin(
        idUser,
        {
          page_number: pageNumber,
        },
        auth?.accessToken,
        axiosJWT
      );
    },
    enabled: Boolean(auth?.accessToken),
  });

  useEffect(() => {
    const value =
      addressList?.contents?.length &&
      addressList?.contents?.map((address) => {
        return { ...address, key: address.addressInfor.id };
      });

    setDataTable(value);
  }, [addressList]);

  const columns = [
    {
      title: "ID",
      dataIndex: "addressInfor",
      render: (addressInfor) => (
        <p className="cursor-pointer">{addressInfor.id}</p>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "addressInfor",
      render: (addressInfor) => (
        <p>
          {addressInfor.address}/{addressInfor.ward}/{addressInfor.district}/
          {addressInfor.city}
        </p>
      ),
    },
    {
      title: "Default",
      dataIndex: "_default",
      render: (_default) => (
        <span style={{ fontWeight: "bold" }}>{_default ? "Yes" : "No"}</span>
      ),
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

  const onChange = (pageNumber, pageSize) => {
    setPageNumber(pageNumber);
  };

  return (
    <div>
      <TableComponent columns={columns} data={dataTable} />

      <div className="flex justify-center mt-2">
        {addressList && (
          <Pagination
            total={addressList?.totalElements}
            pageSize={addressList?.pageSize}
            current={pageNumber}
            showSizeChanger={false}
            onShowSizeChange={onChange}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default DetailAddressList;
