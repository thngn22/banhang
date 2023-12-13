package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.status.StatusOrderDTO;
import com.ecomerce.roblnk.model.StatusOrder;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StatusMapper {
    StatusOrderDTO toStatusOrderDTO(StatusOrder statusOrder);
    List<StatusOrderDTO> toStatusOrderDTOs(List<StatusOrder> statusOrders);
}
