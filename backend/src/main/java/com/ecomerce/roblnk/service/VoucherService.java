package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.voucher.VoucherResponse;

import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getListVouchers();
}
