package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.order.OrderResponsev2;
import com.ecomerce.roblnk.dto.product.RevenueResponse;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.service.AdminService;
import com.ecomerce.roblnk.service.UserService;
import com.ecomerce.roblnk.util.Status;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class IAdminService implements AdminService {
    private final ProductRepository productRepository;
    private final UserService userService;
    @Override
    public RevenueResponse getAllRevenue(Principal principal) {
        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (user != null) {
            RevenueResponse revenueResponse = new RevenueResponse();
            int totalFee = 0;
            var totalRevenue = 0;
            var totalNumberOrdersSuccess = 0;
            var totalNumberOrdersFailure = 0;
            var totalNumberOrders = 0;
            var productList = productRepository.findAll();
            while (!productList.isEmpty()) {
                while (!productList.get(0).getProductItems().isEmpty()) {
                    totalFee += productList.get(0).getProductItems().get(0).getWarehousePrice() * productList.get(0).getProductItems().get(0).getWarehouseQuantity();
                    productList.get(0).getProductItems().remove(0);
                }
                productList.remove(0);
            }
            var orderLists = userService.getAllUserHistoryOrdersForAdmin(principal);
            for (OrderResponsev2 orders : orderLists){
                if (!orders.getStatusOrder().equals(Status.BI_TU_CHOI.toString()) &&
                        !orders.getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) &&
                        !orders.getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())){
                    totalNumberOrdersFailure++;
                }else {
                    totalNumberOrdersSuccess++;
                    totalRevenue += orders.getTotalPayment();
                }
            }
            totalNumberOrders = totalNumberOrdersFailure + totalNumberOrdersSuccess;
            revenueResponse.setTotalFee(totalFee);
            revenueResponse.setTotalRevenue(totalRevenue);
            revenueResponse.setTotalNumberOrders(totalNumberOrders);
            revenueResponse.setTotalNumberOrdersSuccess(totalNumberOrdersSuccess);
            revenueResponse.setTotalNumberOrdersFailure(totalNumberOrdersFailure);
            return revenueResponse;
        }
        return null;
    }
}
