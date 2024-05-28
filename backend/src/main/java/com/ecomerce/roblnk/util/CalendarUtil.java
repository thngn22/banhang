package com.ecomerce.roblnk.util;

import org.joda.time.DateTime;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

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
    public static String convertToYear(DateTime dateToString, DateTime now) {

        if (now.toDate().before(dateToString.toDate())) {
            dateToString = now;
        }

        var date = dateToString.toDate().toString().split(" ");

        if (dateToString.plusSeconds(1).getYear() > dateToString.getYear()) {
            return date[5];
        }
        return date[2] + " "
                + date[1] + " "
                + date[5];
    }
    public static String convertToMonth(DateTime dateToString, DateTime now) {

        if (now.toDate().before(dateToString.toDate())) {
            dateToString = now;
        }
        var date = dateToString.toDate().toString().split(" ");

        if (dateToString.plusSeconds(1).getMonthOfYear() != dateToString.getMonthOfYear()) {
            return date[1] + " "
                    + date[5];
        }
        return date[2] + " "
                + date[1] + " "
                + date[5];
    }
    public static String convertToDay(DateTime dateToString, DateTime now) {
        if (now.toDate().before(dateToString.toDate())) {
            dateToString = now;
        }
        var date = dateToString.toDate().toString().split(" ");
        if (dateToString.plusSeconds(2).getDayOfMonth() != dateToString.getDayOfMonth()) {
            return date[2] + " "
                    + date[1] + " "
                    + date[5];
        }
        return date[3] + " "
                + date[2] + " "
                + date[1] + " "
                + date[5];
    }
    public static String convertToHour(DateTime dateToString, DateTime now) {
        if (now.toDate().before(dateToString.toDate())) {
            dateToString = now;
        }
        var date = dateToString.toDate().toString().split(" ");

        if (!(dateToString.getMinuteOfHour() == 59 && dateToString.getSecondOfMinute() == 59)) {
            return  date[3] + " "
                    + date[2] + " "
                    + date[1] + " "
                    + date[5];
        }
        return date[3].split(":")[0] + "00:00 "
                + date[2] + " "
                + date[1] + " "
                + date[5];
    }
}
