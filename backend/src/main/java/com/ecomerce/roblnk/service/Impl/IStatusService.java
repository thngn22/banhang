package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.status.StatusOrderDTO;
import com.ecomerce.roblnk.mapper.StatusMapper;
import com.ecomerce.roblnk.model.StatusOrder;
import com.ecomerce.roblnk.repository.StatusOrderRepository;
import com.ecomerce.roblnk.service.StatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IStatusService implements StatusService {
    private final StatusOrderRepository statusOrderRepository;
    private final StatusMapper statusMapper;
    @Override
    public List<StatusOrderDTO> getAllStatusOrder() {
        return  statusMapper.toStatusOrderDTOs(statusOrderRepository.findAll());
    }
}
