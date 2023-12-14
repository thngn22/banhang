package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.status.StatusOrderDTO;
import com.ecomerce.roblnk.model.StatusOrder;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:54+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class StatusMapperImpl implements StatusMapper {

    @Override
    public StatusOrderDTO toStatusOrderDTO(StatusOrder statusOrder) {
        if ( statusOrder == null ) {
            return null;
        }

        StatusOrderDTO statusOrderDTO = new StatusOrderDTO();

        statusOrderDTO.setId( statusOrder.getId() );
        statusOrderDTO.setOrderStatus( statusOrder.getOrderStatus() );

        return statusOrderDTO;
    }

    @Override
    public List<StatusOrderDTO> toStatusOrderDTOs(List<StatusOrder> statusOrders) {
        if ( statusOrders == null ) {
            return null;
        }

        List<StatusOrderDTO> list = new ArrayList<StatusOrderDTO>( statusOrders.size() );
        for ( StatusOrder statusOrder : statusOrders ) {
            list.add( toStatusOrderDTO( statusOrder ) );
        }

        return list;
    }
}
