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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IAdminService implements AdminService {
    private final ProductRepository productRepository;
    private final UserService userService;
    @Override
    public RevenueResponse getAllRevenue(Principal principal, String filter) {
        boolean flag = filter != null && !filter.isEmpty();
        var day = new Date(System.currentTimeMillis() - 1000L * 3600 * 24);
        var week = new Date(System.currentTimeMillis() - 1000L * 3600 * 24 * 7);
        var month = new Date(System.currentTimeMillis() - 1000L * 3600 * 24 * 7 * 30);
        var year = new Date(System.currentTimeMillis() - 1000L * 3600 * 24 * 7 * 30 * 12);
        var now = new Date(System.currentTimeMillis());
        var filter_ = "";
        if (flag){
            filter_ = filter;
        }
        else {
            filter_ = "day";
        }

        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (user != null) {
            RevenueResponse revenueResponse = new RevenueResponse();
            List<OrderResponsev2> orderLists = new ArrayList<>();
            var totalRevenue = 0;
            var totalNumberOrdersSuccess = 0;
            var totalNumberOrdersFailure = 0;
            var totalNumberOrders = 0;
            var newAccount = 0;
            var totalAccount = userService.getAllUsers().size();
            switch (filter_){
                case "day" -> {
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, day, now);
                    newAccount = userService.getAllUsersFilter(day, now).size();
                }
                case "week" -> {
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, week, now);
                    newAccount = userService.getAllUsersFilter(week, now).size();
                }
                case "month" -> {
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, month, now);
                    newAccount = userService.getAllUsersFilter(month, now).size();
                }
                case "year" -> {
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, year, now);
                    newAccount = userService.getAllUsersFilter(year, now).size();
                }

            }

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
            revenueResponse.setTotalRevenue(totalRevenue);
            revenueResponse.setNewAccount(newAccount);
            revenueResponse.setTotalAccount(totalAccount);
            revenueResponse.setTotalNumberOrders(totalNumberOrders);
            revenueResponse.setTotalNumberOrdersSuccess(totalNumberOrdersSuccess);
            revenueResponse.setTotalNumberOrdersFailure(totalNumberOrdersFailure);
            return revenueResponse;
        }
        return null;
    }
}
