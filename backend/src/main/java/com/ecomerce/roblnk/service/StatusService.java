package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.status.StatusOrderDTO;
import com.ecomerce.roblnk.model.StatusOrder;

import java.util.List;

public interface StatusService {
    List<StatusOrderDTO> getAllStatusOrder();
}
