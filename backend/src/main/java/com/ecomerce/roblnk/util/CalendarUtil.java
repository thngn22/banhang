package com.ecomerce.roblnk.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

public class CalendarUtil {
    public static Calendar convertToGmt(Calendar calendar){
        Date date = calendar.getTime();
        TimeZone tz = calendar.getTimeZone();
        long msFromEpochGmt = date.getTime();
        int offsetFromUTC = tz.getOffset(msFromEpochGmt);
        Calendar gmtCal = Calendar.getInstance(TimeZone.getTimeZone("GMT"));
        gmtCal.setTime(date);
        gmtCal.add(Calendar.MILLISECOND, offsetFromUTC);
        return gmtCal;
    }
    public static LocalDate convertToLocalDateViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
    public static LocalDate convertToLocalDateViaMilisecond(Date dateToConvert) {
        return Instant.ofEpochMilli(dateToConvert.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
    public static LocalDate convertToLocalDateViaSqlDate(Date dateToConvert) {
        return new java.sql.Date(dateToConvert.getTime()).toLocalDate();
    }
    public static Date convertToDateViaInstant(LocalDate dateToConvert) {
        return java.util.Date.from(dateToConvert.atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }
    public static Date convertToDateViaInstant(LocalDateTime dateToConvert) {
        return java.util.Date
                .from(dateToConvert.atZone(ZoneId.systemDefault())
                        .toInstant());
    }
    public static LocalDate convertToLocalDate(Date dateToConvert) {
        return LocalDate.ofInstant(
                dateToConvert.toInstant(), ZoneId.systemDefault());
    }

    public static LocalDateTime convertToLocalDateTime(Date dateToConvert) {
        return LocalDateTime.ofInstant(
                dateToConvert.toInstant(), ZoneId.systemDefault());
    }
    public static String convertToString(Date dateToString) {

        String first = dateToString.toString().substring(0, 11);
        String last = dateToString.toString().substring(11, 19);
        return first + last;
    }
    public static String convertToMonth(Date dateToString) {

        return dateToString.toString().substring(4, 7);
    }
    public static String convertToDay(Date dateToString) {

        return dateToString.toString().substring(8, 10);
    }
    public static String convertToHour(Date dateToString) {

        return dateToString.toString().substring(11, 13);
    }
}
