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
import org.joda.time.DateTimeZone;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IAdminService implements AdminService {
    private final UserService userService;

    @Override
    public RevenueResponse getAllRevenue(Principal principal, String from, String to) throws ParseException {
        boolean flag = from != null && !from.isEmpty();
        boolean flag2 = to != null && !to.isEmpty();
        DateTimeZone timeZone = DateTimeZone.forID("Asia/Ho_Chi_Minh");

//        DateTime hourStart1 = end_time.withHourOfDay(1);
//        DateTime hourEnd1 = hourStart1.plusHours(1);
//        DateTime dayStart1 = end_time.withTimeAtStartOfDay();
//        DateTime dayEnd1 = dayStart1.plusDays(1).withTimeAtStartOfDay();
//        DateTime weekStart1 = end_time.withDayOfWeek(DateTimeConstants.MONDAY).withTimeAtStartOfDay();
//        DateTime weekEnd1 = end_time.withDayOfWeek(DateTimeConstants.SUNDAY).plusDays(1).withTimeAtStartOfDay();
//        DateTime monthStart1 = end_time.withDayOfMonth(1).withTimeAtStartOfDay();
//        DateTime monthEnd1 = monthStart1.plusMonths(1).withDayOfMonth(1);
//        DateTime yearStart1 = end_time.withDayOfYear(1);
//        DateTime yearEnd1 = yearStart1.plusYears(1).withDayOfYear(1);

        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");


        var filter_ = "lmao";
        if (flag && flag2) {
            Date start_time = format.parse(from);
            Date end_time = format.parse(to);
            long difference_in_time = end_time.getTime() - start_time.getTime();
            long difference_in_seconds = (difference_in_time / 1000) % 60;
            long difference_in_minutes = (difference_in_time / (1000 * 60)) % 60;
            long difference_in_hours = (difference_in_time / (1000 * 60 * 60)) % 24;
            long difference_in_days = (difference_in_time / (1000 * 60 * 60 * 24)) % 365;
            long difference_in_weeks = (difference_in_time / (1000 * 60 * 60 * 24 * 7)) % 365;
            long difference_in_months = (difference_in_time / (1000L * 60 * 60 * 24 * 30)) % 365;
            long difference_in_years = (difference_in_time / (1000L * 60 * 60 * 24 * 365));

            System.out.println("difference_in_time: " + difference_in_time);
            System.out.println("difference_in_years: " + difference_in_years);
            System.out.println("difference_in_months: " + difference_in_months);
            System.out.println("difference_in_weeks: " + difference_in_weeks);
            System.out.println("difference_in_days: " + difference_in_days);
            System.out.println("difference_in_hours: " + difference_in_hours);
            System.out.println("difference_in_minutes: " + difference_in_minutes);
            System.out.println("difference_in_seconds: " + difference_in_seconds);

            if (difference_in_years == 0) {
                if (difference_in_months == 0) {
                    if (difference_in_weeks == 0) {
                        if (difference_in_days == 0) {
                            filter_ = "day";
                        } else filter_ = "week";

                    } else filter_ = "month";

                } else filter_ = "year";

            } else filter_ = "year";


        } else {
            filter_ = "day";
        }
        System.out.println(filter_);
        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (user != null) {
            DateTime end_time = new DateTime(format.parse(to), timeZone);
            DateTime start_time = new DateTime(format.parse(from), timeZone);
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
                    DateTime hourStart = start_time.hourOfDay().getDateTime();
                    DateTime hourEnd = hourStart.plusHours(1);
                    DateTime dayStart = hourStart;
                    DateTime dayEnd = end_time.hourOfDay().getDateTime();
                    System.out.println("dayStart: " + dayStart);
                    System.out.println("dayEnd: " + dayEnd);
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, dayStart.toDate(), dayEnd.toDate());
                    System.out.println(orderLists.size());
                    newAccount = userService.getAllUsersFilter(hourStart.toDate(), hourEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 24; i++) {
                        if (hourStart.isAfter(dayEnd)) {
                            break;
                        }
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
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
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

                        if ((hourEnd.plusHours(1).getWeekOfWeekyear() > hourEnd.getWeekOfWeekyear()) || (hourEnd.plusHours(1).getMonthOfYear() > hourEnd.getMonthOfYear()) || (hourEnd.plusHours(1).getYear() > hourEnd.getYear())) {
                            var coefficient = 60;
                            while ((hourEnd.plusMinutes(coefficient).getMonthOfYear() > hourEnd.getMonthOfYear()) || (hourEnd.plusMinutes(coefficient).getYear() > hourEnd.getYear())) {
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
                    DateTime dayStart = start_time.dayOfWeek().getDateTime();
                    DateTime dayEnd = start_time.plusDays(1).withTimeAtStartOfDay();
                    DateTime weekStart = dayStart;
                    DateTime weekEnd = end_time.dayOfWeek().getDateTime();

                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, weekStart.toDate(), weekEnd.toDate());
                    System.out.println(orderLists.size());
                    newAccount = userService.getAllUsersFilter(weekStart.toDate(), weekEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 7; i++) {
                        if (dayStart.isAfter(weekEnd)) {
                            break;
                        }
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
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
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
                        if ((dayEnd.plusDays(1).getWeekOfWeekyear() > dayEnd.getWeekOfWeekyear()) || (dayEnd.plusDays(1).getMonthOfYear() > dayEnd.getMonthOfYear()) || (dayEnd.plusDays(1).getYear() > dayEnd.getYear())) {
                            var coefficient = 24;
                            while ((dayEnd.plusHours(coefficient).getMonthOfYear() > dayEnd.getMonthOfYear()) || (dayEnd.plusHours(coefficient).getYear() > dayEnd.getYear())) {
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
                    DateTime weekStart = start_time.weekOfWeekyear().getDateTime();
                    DateTime weekEnd = weekStart.plusWeeks(1).withTimeAtStartOfDay();
                    DateTime monthStart = weekStart;
                    DateTime monthEnd = end_time.weekOfWeekyear().getDateTime();
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, monthStart.toDate(), monthEnd.toDate());
                    newAccount = userService.getAllUsersFilter(monthStart.toDate(), monthEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 5; i++) {
                        if (weekStart.isAfter(monthEnd)) {
                            break;
                        }
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;

                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            while (dateTime.isAfter(weekStart) && dateTime.isBefore(weekEnd) && weekStart.isBefore(weekEnd)) {
                                check = true;
                                System.out.println("DDax vao");
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
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
                        if ((weekEnd.plusWeeks(1).getMonthOfYear() > weekEnd.getMonthOfYear()) || (weekEnd.plusWeeks(1).getYear() > weekEnd.getYear())) {
                            var coefficient = 6;
                            while ((weekEnd.plusDays(coefficient).getMonthOfYear() > weekEnd.getMonthOfYear()) || (weekEnd.plusDays(coefficient).getYear() > weekEnd.getYear())) {
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
                    DateTime monthStart = start_time.monthOfYear().getDateTime();
                    DateTime monthEnd = monthStart.plusMonths(1).withTimeAtStartOfDay();
                    DateTime yearStart = monthStart;
                    DateTime yearEnd = end_time.monthOfYear().getDateTime();

                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, yearStart.toDate(), yearEnd.toDate());
                    newAccount = userService.getAllUsersFilter(monthStart.toDate(), monthEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    for (int i = 1; i <= 12; i++) {
                        System.out.println("monthStart: " + monthStart);
                        System.out.println("monthEnd: " + monthEnd);
                        if (monthStart.isAfter(yearEnd)) {
                            break;
                        }

                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;

                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            while (dateTime.isAfter(monthStart) && dateTime.isBefore(monthEnd) && monthStart.isBefore(monthEnd)) {
                                check = true;
                                System.out.println("DDax vao");
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
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
                            while ((monthEnd.plusDays(coefficient).getMonthOfYear() > monthEnd.getMonthOfYear()) || (monthEnd.plusDays(coefficient).getYear() > monthEnd.getYear())) {
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
                if (!orders.getStatusOrder().equals(Status.BI_TU_CHOI.toString()) && !orders.getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) && !orders.getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
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
