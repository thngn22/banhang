package com.ecomerce.roblnk.util;

import jakarta.servlet.http.HttpServletRequest;

public class ClientSide {
    public static final String CLIENT_SITE_URL = "http://localhost:3030";

    public static String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        return siteURL.replace(request.getServletPath(), "");
    }

}