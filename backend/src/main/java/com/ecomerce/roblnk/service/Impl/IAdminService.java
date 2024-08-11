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
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class IAdminService implements AdminService {
    private final UserService userService;

    @Override
    public RevenueResponse getAllRevenue(Principal principal, String from, String to, String type) throws ParseException {
        boolean flag = from != null && !from.isEmpty();
        boolean flag2 = to != null && !to.isEmpty();
        DateTimeZone timeZone = DateTimeZone.forID("Asia/Ho_Chi_Minh");
        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        DateTime now = new DateTime(timeZone);
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

//
//
//        var filter_ = "lmao";
//        if (flag && flag2) {
//            Date start_time = format.parse(from);
//            Date end_time = format.parse(to);
//            long difference_in_time = end_time.getTime() - start_time.getTime();
//            long difference_in_seconds = (difference_in_time / 1000) % 60;
//            long difference_in_minutes = (difference_in_time / (1000 * 60)) % 60;
//            long difference_in_hours = (difference_in_time / (1000 * 60 * 60)) % 24;
//            long difference_in_days = (difference_in_time / (1000 * 60 * 60 * 24)) % 365;
//            long difference_in_weeks = (difference_in_time / (1000 * 60 * 60 * 24 * 7)) % 365;
//            long difference_in_months = (difference_in_time / (1000L * 60 * 60 * 24 * 30)) % 365;
//            long difference_in_years = (difference_in_time / (1000L * 60 * 60 * 24 * 365));
//
//            if (difference_in_years == 0) {
//                if (difference_in_months == 0) {
//                    if (difference_in_weeks == 0) {
//                        if (difference_in_days == 0) {
//                            filter_ = "day";
//                        } else filter_ = "week";
//
//                    } else filter_ = "month";
//
//                } else filter_ = "year";
//
//            } else filter_ = "year";
//
//
//        } else {
//            filter_ = "day";
//        }
//        System.out.println(filter_);
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
            switch (type) {
                case "hour" -> {
                    DateTime hourStart = start_time.hourOfDay().getDateTime();
                    DateTime hourEnd = hourStart.plusHours(1).withMinuteOfHour(0).withSecondOfMinute(0).minusSeconds(1);
                    DateTime dayStart = hourStart;
                    DateTime dayEnd = end_time.hourOfDay().getDateTime();
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, dayStart.toDate(), dayEnd.toDate());
                    newAccount = userService.getAllUsersFilter(hourStart.toDate(), hourEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    while (hourStart.isBefore(dayEnd)) {
                        if (hourStart.isAfter(dayEnd)) {
                            break;
                        }
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;
                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            while (dateTime.isAfter(hourStart) && dateTime.isBefore(hourEnd) && hourStart.isBefore(hourEnd)) {
                                if (!temp.isEmpty() && !temp.get(0).getStatusOrder().equals(Status.BI_TU_CHOI.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString()) && !temp.get(0).getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString())) {
                                    check = true;
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

                            if (check && hourStart.isBefore(hourEnd)) {
                                if (hourEnd.getMinuteOfHour()-hourStart.getMinuteOfHour() != hourEnd.getMinuteOfHour()-hourEnd.withMinuteOfHour(0).getMinuteOfHour()){
                                    System.out.println("1hourStart");
                                    ordersObject.setTime(CalendarUtil.convertToHour(hourStart, now));
                                }
                                else{
                                    System.out.println("1hourEnd");
                                    ordersObject.setTime(CalendarUtil.convertToHour(hourEnd, now));

                                }
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);
                            }

                            ;
                        }

                        if (!check && hourStart.isBefore(hourEnd.plusSeconds(1))) {
                            if (hourEnd.getMinuteOfHour()-hourStart.getMinuteOfHour() != hourEnd.getMinuteOfHour()-hourEnd.withMinuteOfHour(0).getMinuteOfHour()){
                                ordersObject.setTime(CalendarUtil.convertToHour(hourStart, now));
                            }
                            else{
                                ordersObject.setTime(CalendarUtil.convertToHour(hourEnd, now));

                            }
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);
                        }
                        log.info("hourStart: {}, hourEnd: {}", hourStart, hourEnd);

                        if (hourEnd.plusSeconds(1).plusHours(1).isAfter(dayEnd)) {
                            hourStart = hourEnd.plusHours(1).withMinuteOfHour(0).withSecondOfMinute(0);
                            hourEnd = dayEnd;
                        } else {
                            hourStart = hourStart.plusHours(1).withMinuteOfHour(0).withSecondOfMinute(0);
                            hourEnd = hourStart.plusHours(1).withMinuteOfHour(0).withSecondOfMinute(0).minusSeconds(1);
                        }
                    }

                }
                case "day" -> {
                    DateTime dayStart = start_time.dayOfMonth().getDateTime();
                    DateTime dayEnd = start_time.plusDays(1).withTimeAtStartOfDay().minusSeconds(1);
                    DateTime weekStart = dayStart;
                    DateTime weekEnd = end_time.dayOfMonth().getDateTime();

                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, weekStart.toDate(), weekEnd.toDate());
                    newAccount = userService.getAllUsersFilter(weekStart.toDate(), weekEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    while (dayStart.isBefore(weekEnd)) {
                        log.info("dayStart: {}, dayEnd: {}", dayStart, dayEnd);

                        if (dayStart.isAfter(weekEnd) || dayStart.isAfterNow()) {
                            break;
                        }
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;
                        if (!temp.isEmpty()) {
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            while (dateTime.isAfter(dayStart) && dateTime.isBefore(dayEnd) && dayStart.isBefore(dayEnd)) {
                                check = true;
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
                            if (check && dayStart.isBefore(dayEnd)) {
                                if (dayEnd.getHourOfDay()-dayStart.getHourOfDay() != dayEnd.getHourOfDay()-dayEnd.withHourOfDay(1).getHourOfDay()){
                                    ordersObject.setTime(CalendarUtil.convertToDay(dayStart, now));
                                }
                                else
                                    ordersObject.setTime(CalendarUtil.convertToDay(dayEnd, now));
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);
                            }

                        }
                        if (!check && dayStart.isBefore(dayEnd)) {
                            if (dayEnd.getHourOfDay()-dayStart.getHourOfDay() != dayEnd.getHourOfDay()-dayEnd.withHourOfDay(0).getHourOfDay()){
                                ordersObject.setTime(CalendarUtil.convertToDay(dayStart, now));
                            }
                            else
                                ordersObject.setTime(CalendarUtil.convertToDay(dayEnd, now));
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);
                        }

                        if (dayEnd.plusSeconds(1).plusDays(1).isAfter(weekEnd)) {

                            dayStart = dayEnd.plusDays(1).withTimeAtStartOfDay();
                            dayEnd = weekEnd;
                        } else {
                            dayStart = dayStart.plusDays(1).withTimeAtStartOfDay();
                            dayEnd = dayStart.plusDays(1).withTimeAtStartOfDay().minusSeconds(1);
                        }
                    }

                }
                case "month" -> {
                    DateTime weekStart = start_time.monthOfYear().getDateTime();
                    DateTime weekEnd = weekStart.plusMonths(1).withDayOfMonth(1).withTimeAtStartOfDay().minusSeconds(1);
                    DateTime monthStart = weekStart;
                    DateTime monthEnd = end_time.monthOfYear().getDateTime();
                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, monthStart.toDate(), monthEnd.toDate());
                    newAccount = userService.getAllUsersFilter(monthStart.toDate(), monthEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    while (weekStart.isBefore(monthEnd.plusSeconds(1))) {
                        if (weekStart.isAfter(monthEnd) || weekStart.isAfterNow()) {
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
                                if (weekEnd.getDayOfMonth()-weekStart.getDayOfMonth() != weekEnd.getDayOfMonth()-weekEnd.withDayOfMonth(1).getDayOfMonth()){
                                    ordersObject.setTime(CalendarUtil.convertToMonth(weekStart, now));
                                }
                                else{
                                    ordersObject.setTime(CalendarUtil.convertToMonth(weekEnd, now));
                                }
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);
                            }
                        }
                        if (!check && weekStart.isBefore(weekEnd.plusSeconds(2))) {
                            if (weekEnd.getDayOfMonth()-weekStart.getDayOfMonth() != weekEnd.getDayOfMonth()-weekEnd.withDayOfMonth(1).getDayOfMonth()){
                                ordersObject.setTime(CalendarUtil.convertToMonth(weekStart, now));
                            }
                            else{
                                ordersObject.setTime(CalendarUtil.convertToMonth(weekEnd, now));
                            }
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);

                        }
                        if (weekEnd.plusSeconds(1).plusMonths(1).isAfter(monthEnd)) {
                            weekStart = weekStart.plusMonths(1).withDayOfMonth(1).withTimeAtStartOfDay();
                            weekEnd = monthEnd;
                        } else {
                            weekStart = weekStart.plusMonths(1).withDayOfMonth(1).withTimeAtStartOfDay();
                            weekEnd = weekStart.plusMonths(1).withDayOfMonth(1).withTimeAtStartOfDay().minusSeconds(1);
                        }

                    }

                }
                case "year" -> {
                    DateTime monthStart = start_time.year().getDateTime();
                    DateTime monthEnd = monthStart.plusYears(1).withDayOfYear(1).withTimeAtStartOfDay().minusSeconds(1);
                    DateTime yearStart = monthStart;
                    DateTime yearEnd = end_time.year().getDateTime();

                    orderLists = userService.getAllUserHistoryOrdersForAdminFilter(principal, yearStart.toDate(), yearEnd.toDate());
                    log.info(String.valueOf(orderLists.size()));
                    newAccount = userService.getAllUsersFilter(yearStart.toDate(), yearEnd.toDate()).size();
                    List<OrderResponsev2> temp = new ArrayList<>(orderLists);
                    while (monthStart.isBefore(yearEnd)){
                        log.info("monthStart: {}, monthEnd: {}", monthStart, monthEnd);

                        if (monthStart.isAfter(yearEnd) || monthStart.isAfterNow()) {
                            break;
                        }
                        if (yearEnd.isBefore(monthEnd)){
                            monthEnd = yearEnd;
                        }
                        OrdersObject ordersObject = new OrdersObject();
                        boolean check = false;
                        Integer total = 0;

                        if (!temp.isEmpty()) {
                            log.info(String.valueOf(temp.size()));
                            var time = temp.get(0).getUpdateAt();
                            DateTime dateTime = new DateTime(time);
                            while (dateTime.isAfter(monthStart) && dateTime.isBefore(monthEnd) && monthStart.isBefore(monthEnd)) {
                                check = true;
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
                            if (monthStart.isBefore(monthEnd) && check) {
                                if (monthEnd.getDayOfYear()-monthStart.getDayOfYear() != monthEnd.getDayOfYear()-monthEnd.withDayOfYear(1).getDayOfYear()){
                                    ordersObject.setTime(CalendarUtil.convertToYear(monthStart, now));
                                }
                                else
                                    ordersObject.setTime(CalendarUtil.convertToYear(monthEnd, now));
                                ordersObject.setTotalRevenue(total);
                                listOrdersRevenue.add(ordersObject);
                            }
                        }
                        if (!check && monthStart.isBefore(monthEnd.plusSeconds(2))) {
                            if (monthEnd.getDayOfYear()-monthStart.getDayOfYear() != monthEnd.getDayOfYear()-monthEnd.withDayOfYear(1).getDayOfYear()){
                                ordersObject.setTime(CalendarUtil.convertToYear(monthStart, now));
                            }
                            else
                                ordersObject.setTime(CalendarUtil.convertToYear(monthEnd, now));
                            ordersObject.setTotalRevenue(total);
                            listOrdersRevenue.add(ordersObject);
                        }

                        if (monthEnd.plusSeconds(1).plusYears(1).isAfter(yearEnd)) {

                            monthStart = monthEnd.plusYears(1).withDayOfYear(1).withTimeAtStartOfDay();
                            monthEnd = yearEnd;
                        } else {
                            monthStart = monthStart.plusYears(1).withDayOfYear(1).withTimeAtStartOfDay();
                            monthEnd = monthStart.plusYears(1).withDayOfYear(1).withTimeAtStartOfDay().minusSeconds(1);
                        }

                    }

                }
            }
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
