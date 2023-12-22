package com.ecomerce.roblnk.util;

import jakarta.servlet.http.HttpServletRequest;

public class Side {
    public static final String CLIENT_SITE_URL = "https://shoes-shop-vip.vercel.app/";
    public static final String SERVER_SITE_URL = "https://shoes-shop-vip.up.railway.app";
    public static final String CLIENT_SITE_URL_ORDER_HISTORY = CLIENT_SITE_URL + "/history-order";

    public static String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        return siteURL.replace(request.getServletPath(), "");
    }

}