package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.voucher.VoucherResponse;
import com.ecomerce.roblnk.mapper.VoucherMapper;
import com.ecomerce.roblnk.repository.VoucherRepository;
import com.ecomerce.roblnk.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IVoucherService implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @Override
    public List<VoucherResponse> getListVouchers() {
        var vouchers = voucherRepository.findAll();
        return voucherMapper.toVoucherResponseList(vouchers);
    }

}
