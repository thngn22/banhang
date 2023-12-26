package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.order.OrderResponsev2;
import com.ecomerce.roblnk.dto.order.OrdersObject;
import com.ecomerce.roblnk.dto.product.RevenueResponse;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.service.AdminService;
import com.ecomerce.roblnk.service.UserService;
import com.ecomerce.roblnk.util.CalendarUtil;
import com.ecomerce.roblnk.util.Status;
import lombok.RequiredArgsConstructor;
import org.joda.time.DateTime;
import org.joda.time.DateTimeConstants;
import org.joda.time.DateTimeZone;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IAdminService implements AdminService {
    private final UserService userService;

    @Override
    public RevenueResponse getAllRevenue(Principal principal, String filter) {
        boolean flag = filter != null && !filter.isEmpty();
        DateTimeZone timeZone = DateTimeZone.forID("Asia/Ho_Chi_Minh");
        DateTime now_ = new DateTime(timeZone);
//        DateTime hourStart1 = now_.withHourOfDay(1);
//        DateTime hourEnd1 = hourStart1.plusHours(1);
//        DateTime dayStart1 = now_.withTimeAtStartOfDay();
//        DateTime dayEnd1 = dayStart1.plusDays(1).withTimeAtStartOfDay();
//        DateTime weekStart1 = now_.withDayOfWeek(DateTimeConstants.MONDAY).withTimeAtStartOfDay();
//        DateTime weekEnd1 = now_.withDayOfWeek(DateTimeConstants.SUNDAY).plusDays(1).withTimeAtStartOfDay();
//        DateTime monthStart1 = now_.withDayOfMonth(1).withTimeAtStartOfDay();
//        DateTime monthEnd1 = monthStart1.plusMonths(1).withDayOfMonth(1);
//        DateTime yearStart1 = now_.withDayOfYear(1);
//        DateTime yearEnd1 = yearStart1.plusYears(1).withDayOfYear(1);


        var filter_ = "";
        if (flag) {
            filter_ = filter;
        } else {
            filter_ = "day";
        }

        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (user != null) {
            RevenueResponse revenueResponse = new RevenueResponse();
            List<OrderResponsev2> orderLists = new ArrayList<>();
            List<OrdersObject> listOrdersRevenue = new ArrayList<>();
            var totalRevenue = 0;
            var totalNumberOrdersSuccess = 0;
            var totalNumberOrdersFailure = 0;
            var totalNumberOrders = 0;
            var newAccount = 0;
            var totalAccount = userService.getAllUsers().size();
            switch (filter_) {
                case "day" -> {
                    DateTime hourStart = now_.withTimeAtStartOfDay();
                    DateTime hourEnd = hourStart.plusHours(1);
                    DateTime dayStart = now_.withTimeAtStartOfDay();
                    DateTime dayEnd = dayStart.plusDays(1).withTimeAtStartOfDay();
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, dayStart.toDate(), dayEnd.toDate());
                    System.out.println(orderLists.size());
                    newAccount = userService.getAllUsersFilter(hourStart.toDate(), hourEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 24; i++) {
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;
                        System.out.println("i: " + i);
                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            System.out.println("dayStart" + hourStart);
                            System.out.println("dayEnd" + hourEnd);
                            System.out.println("dateTime" + dateTime);
                            while (dateTime.isAfter(hourStart) && dateTime.isBefore(hourEnd) && hourStart.isBefore(hourEnd)) {
                                System.out.println("DDax vao");
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
                                    check = true;
                                    System.out.println("DDax vao trhanh cong");
                                    System.out.println("status: " + temp.get(0).getStatusOrder());
                                    total += temp.get(0).getTotalPayment();
                                    temp.remove(0);
                                    if (!temp.isEmpty()) {
                                        time = temp.get(0).getUpdateAt();
                                        dateTime = new DateTime(time);
                                    }
                                } else {
                                    if (!temp.isEmpty()) {
                                        temp.remove(0);
                                    } else break;
                                }

                            }
                            System.out.println("check" + check);
                            System.out.println("dayStart.isBefore(dayEnd)" + hourStart.isBefore(hourEnd));
                            if (check && hourStart.isBefore(hourEnd)) {
                                ordersObject.setTime(CalendarUtil.convertToHour(hourStart.toDate()));
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);
                                System.out.println("total con: " + total);
                                System.out.println("listOrdersRevenue con: " + listOrdersRevenue.size());
                            }
                            ;
                        }
                        System.out.println("check" + check);
                        System.out.println("dayStart.isBefore(dayEnd)" + hourStart.isBefore(hourEnd));
                        if (!check && hourStart.isBefore(hourEnd)) {
                            ordersObject.setTime(CalendarUtil.convertToHour(hourStart.toDate()));
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);
                            System.out.println("total" + total);
                            System.out.println("listOrdersRevenue" + listOrdersRevenue.size());

                        }
                        if ((hourEnd.plusHours(1).getWeekOfWeekyear() > hourEnd.getWeekOfWeekyear()) ||
                                (hourEnd.plusHours(1).getMonthOfYear() > hourEnd.getMonthOfYear()) ||
                                (hourEnd.plusHours(1).getYear() > hourEnd.getYear())) {
                            var coefficient = 60;
                            while ((hourEnd.plusMinutes(coefficient).getMonthOfYear() > hourEnd.getMonthOfYear()) ||
                                    (hourEnd.plusMinutes(coefficient).getYear() > hourEnd.getYear())) {
                                coefficient--;
                            }
                            hourEnd = hourEnd.plusMinutes(coefficient);
                            hourStart = hourStart.plusHours(1);
                            System.out.println("coefficient" + coefficient);
                        } else {
                            hourStart = hourStart.plusHours(1);
                            hourEnd = hourEnd.plusHours(1);
                        }
                    }


                }
                case "week" -> {
                    DateTime weekStart = now_.withDayOfWeek(1).withTimeAtStartOfDay();
                    DateTime weekEnd = now_.withDayOfWeek(DateTimeConstants.SUNDAY).plusDays(1).withTimeAtStartOfDay();
                    DateTime dayStart = weekStart.withTimeAtStartOfDay();
                    DateTime dayEnd = dayStart.plusDays(1).withTimeAtStartOfDay();
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, weekStart.toDate(), weekEnd.toDate());
                    System.out.println(orderLists.size());
                    newAccount = userService.getAllUsersFilter(weekStart.toDate(), weekEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 7; i++) {
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;
                        System.out.println("i: " + i);
                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            System.out.println("dayStart" + dayStart);
                            System.out.println("dayEnd" + dayEnd);
                            System.out.println("dateTime" + dateTime);
                            while (dateTime.isAfter(dayStart) && dateTime.isBefore(dayEnd) && dayStart.isBefore(dayEnd)) {
                                check = true;
                                System.out.println("DDax vao");
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
                                    total += temp.get(0).getTotalPayment();
                                    temp.remove(0);
                                    if (!temp.isEmpty()) {
                                        time = temp.get(0).getUpdateAt();
                                        dateTime = new DateTime(time);
                                    }
                                } else {
                                    if (!temp.isEmpty()) {
                                        temp.remove(0);
                                    } else break;
                                }

                            }
                            System.out.println("check" + check);
                            System.out.println("dayStart.isBefore(dayEnd)" + dayStart.isBefore(dayEnd));
                            if (check && dayStart.isBefore(dayEnd)) {
                                ordersObject.setTime(CalendarUtil.convertToDay(dayStart.toDate()));
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);
                                System.out.println("total con: " + total);
                                System.out.println("listOrdersRevenue con: " + listOrdersRevenue.size());
                            }
                            ;
                        }
                        System.out.println("check" + check);
                        System.out.println("dayStart.isBefore(dayEnd)" + dayStart.isBefore(dayEnd));
                        if (!check && dayStart.isBefore(dayEnd)) {
                            ordersObject.setTime(CalendarUtil.convertToDay(dayStart.toDate()));
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);
                            System.out.println("total" + total);
                            System.out.println("listOrdersRevenue" + listOrdersRevenue.size());

                        }
                        if ((dayEnd.plusDays(1).getWeekOfWeekyear() > dayEnd.getWeekOfWeekyear()) ||
                                (dayEnd.plusDays(1).getMonthOfYear() > dayEnd.getMonthOfYear()) ||
                                (dayEnd.plusDays(1).getYear() > dayEnd.getYear())) {
                            var coefficient = 24;
                            while ((dayEnd.plusHours(coefficient).getMonthOfYear() > dayEnd.getMonthOfYear()) ||
                                    (dayEnd.plusHours(coefficient).getYear() > dayEnd.getYear())) {
                                coefficient--;
                            }
                            dayEnd = dayEnd.plusHours(coefficient);
                            dayStart = dayStart.plusDays(1);
                            System.out.println("coefficient" + coefficient);
                        } else {
                            dayStart = dayStart.plusDays(1).withTimeAtStartOfDay();
                            dayEnd = dayEnd.plusDays(1).withTimeAtStartOfDay();
                        }
                    }

                }
                case "month" -> {
                    DateTime weekStart = now_.withDayOfMonth(1).withTimeAtStartOfDay();
                    DateTime weekEnd = weekStart.plusWeeks(1).withTimeAtStartOfDay();
                    DateTime monthStart = now_.withDayOfMonth(1).withTimeAtStartOfDay();
                    DateTime monthEnd = weekStart.plusMonths(1).withDayOfMonth(1).withTimeAtStartOfDay();
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, monthStart.toDate(), monthEnd.toDate());
                    newAccount = userService.getAllUsersFilter(monthStart.toDate(), monthEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 5; i++) {
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;

                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            while (dateTime.isAfter(weekStart) && dateTime.isBefore(weekEnd) && weekStart.isBefore(weekEnd)) {
                                check = true;
                                System.out.println("DDax vao");
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
                                    total += temp.get(0).getTotalPayment();
                                    temp.remove(0);
                                    if (!temp.isEmpty()) {
                                        time = temp.get(0).getUpdateAt();
                                        dateTime = new DateTime(time);
                                    }
                                } else {
                                    if (!temp.isEmpty()) {
                                        temp.remove(0);
                                    } else break;
                                }

                            }
                            if (weekStart.isBefore(weekEnd) && check) {
                                ordersObject.setTime(CalendarUtil.convertToDay(weekStart.toDate()));
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);

                            }
                        }
                        if (!check && weekStart.isBefore(weekEnd)) {
                            ordersObject.setTime(CalendarUtil.convertToDay(weekStart.toDate()));
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);

                        }
                        if ((weekEnd.plusWeeks(1).getMonthOfYear() > weekEnd.getMonthOfYear()) ||
                                (weekEnd.plusWeeks(1).getYear() > weekEnd.getYear())) {
                            var coefficient = 6;
                            while ((weekEnd.plusDays(coefficient).getMonthOfYear() > weekEnd.getMonthOfYear()) ||
                                    (weekEnd.plusDays(coefficient).getYear() > weekEnd.getYear())) {
                                coefficient--;
                            }
                            weekEnd = weekEnd.plusDays(coefficient);
                            weekStart = weekStart.plusWeeks(1);
                            System.out.println(coefficient);
                        } else {
                            weekStart = weekStart.plusWeeks(1);
                            weekEnd = weekEnd.plusWeeks(1);
                        }

                    }
                }
                case "year", "all" -> {
                    DateTime yearStart = now_.withDayOfYear(1).withTimeAtStartOfDay();
                    DateTime yearEnd = yearStart.plusYears(1).withDayOfYear(1).withTimeAtStartOfDay();
                    DateTime monthStart = yearStart.withDayOfMonth(1).withTimeAtStartOfDay();
                    DateTime monthEnd = monthStart.plusMonths(1).withDayOfMonth(1);
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, yearStart.toDate(), yearEnd.toDate());
                    newAccount = userService.getAllUsersFilter(monthStart.toDate(), monthEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 12; i++) {
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;

                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            while (dateTime.isAfter(monthStart) && dateTime.isBefore(monthEnd) && monthStart.isBefore(monthEnd)) {
                                check = true;
                                System.out.println("DDax vao");
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) &&
                                        !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
                                    System.out.println("monthStart" + monthStart);
                                    System.out.println("monthEnd" + monthEnd);
                                    System.out.println("dateTime" + dateTime);
                                    total += temp.get(0).getTotalPayment();
                                    temp.remove(0);
                                    if (!temp.isEmpty()) {
                                        time = temp.get(0).getUpdateAt();
                                        dateTime = new DateTime(time);
                                    }
                                } else {
                                    if (!temp.isEmpty()) {
                                        temp.remove(0);
                                    } else break;
                                }

                            }
                            System.out.println("check" + check);
                            System.out.println("dayStart.isBefore(dayEnd)" + monthStart.isBefore(monthEnd));

                            if (monthStart.isBefore(monthEnd) && check) {
                                ordersObject.setTime(CalendarUtil.convertToMonth(monthStart.toDate()));
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);
                                System.out.println("total con: " + total);
                                System.out.println("listOrdersRevenue con: " + listOrdersRevenue.size());

                            }
                        }
                        System.out.println("check" + check);
                        System.out.println("dayStart.isBefore(dayEnd)" + monthStart.isBefore(monthEnd));

                        if (!check && monthStart.isBefore(monthEnd)) {
                            ordersObject.setTime(CalendarUtil.convertToMonth(monthStart.toDate()));
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);
                            System.out.println("total con: " + total);
                            System.out.println("listOrdersRevenue con: " + listOrdersRevenue.size());

                        }
                        if (monthEnd.plusMonths(1).getYear() > monthEnd.getYear()) {
                            var coefficient = 31;
                            while ((monthEnd.plusDays(coefficient).getMonthOfYear() > monthEnd.getMonthOfYear()) ||
                                    (monthEnd.plusDays(coefficient).getYear() > monthEnd.getYear())) {
                                coefficient--;
                            }
                            monthEnd = monthEnd.plusDays(coefficient);
                            monthStart = monthStart.plusMonths(1);
                            System.out.println("coefficient" + coefficient);
                        } else {
                            monthStart = monthStart.plusMonths(1);
                            monthEnd = monthEnd.plusMonths(1);
                        }

                    }
                }
            }
            System.out.println(orderLists.size());
            for (OrderResponsev2 orders : orderLists) {
                if (!orders.getStatusOrder().equals(Status.BI_TU_CHOI.toString()) &&
                        !orders.getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) &&
                        !orders.getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
                    totalNumberOrdersSuccess++;
                    totalRevenue += orders.getTotalPayment();
                } else {
                    totalNumberOrdersFailure++;
                }
            }
            totalNumberOrders = totalNumberOrdersFailure + totalNumberOrdersSuccess;
            revenueResponse.setTotalRevenue(totalRevenue);
            revenueResponse.setNewAccount(newAccount);
            revenueResponse.setTotalAccount(totalAccount);
            revenueResponse.setTotalNumberOrders(totalNumberOrders);
            revenueResponse.setTotalNumberOrdersSuccess(totalNumberOrdersSuccess);
            revenueResponse.setTotalNumberOrdersFailure(totalNumberOrdersFailure);
            revenueResponse.setListOrdersRevenue(listOrdersRevenue);
            return revenueResponse;
        }
        return null;
    }

}
