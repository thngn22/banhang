import React from "react";
import { formatDateInHisoryOrder } from "../../../utils/untils";

const HistoryOrder = ({ data, refetch }) => {
  return (
    <div className="pl-8">
      {data ? (
        <div>
          <h2 className="text-xl font-bold mb-2">History Order</h2>
          <table className="text-sm min-w-full border border-gray-200">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="py-2 border-b border-gray-200">ID</th>
                <th className="border-b border-gray-200">Total amount</th>
                <th className="py-2 border-b border-gray-200">Total items</th>
                <th className="py-2 border-b border-gray-200">Phone number</th>
                <th className="py-2 border-b border-gray-200">Created At</th>
                <th className="py-2 border-b border-gray-200">
                  Payment method
                </th>
                <th className="py-2 border-b border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-200 cursor-pointer">
                  <td className="py-2 border-b border-gray-200 text-center">
                    {order.id}
                  </td>
                  <td className="py-2 border-b border-gray-200 text-center text-red-500 font-semibold">
                    {order.totalPayment.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="py-2 border-b border-gray-200 text-center">
                    {order.totalItem}
                  </td>
                  <td className="py-2 border-b border-gray-200 text-center">
                    {order.customerPhoneNumber || "N/A"}
                  </td>
                  <td className="py-2 border-b border-gray-200 text-center">
                    {formatDateInHisoryOrder(order.createdAt)}
                  </td>
                  <td className="py-2 border-b border-gray-200 text-center">
                    {order.userPaymentMethod.nameMethod}
                  </td>
                  <td className="py-2 border-b border-gray-200 text-center">
                    {order.statusOrder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No history orders available</p>
      )}
    </div>
  );
};

export default HistoryOrder;
