package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.product.RevenueResponse;

import java.security.Principal;

public interface AdminService {
    RevenueResponse getAllRevenue(Principal principal);
}
