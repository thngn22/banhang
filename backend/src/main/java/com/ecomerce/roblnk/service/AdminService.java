package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.product.RevenueResponse;

import java.security.Principal;
import java.text.ParseException;

public interface AdminService {
    RevenueResponse getAllRevenue(Principal principal, String from, String to, String type) throws ParseException;

}
