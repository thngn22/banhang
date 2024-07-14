package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.PageResponse;
import com.ecomerce.roblnk.dto.voucher.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;

public interface VoucherService {
    PageResponse getListVouchers(FilterVoucherRequest filterVoucherRequest);

    String createVoucher(VoucherRequest voucherRequest);

    String editVoucher(EditVoucherRequest editVoucherRequest);

    String deleteVoucher(Long id);

    ResponseEntity<?> applyVoucher(ApplyVoucherRequest voucherRequest, Principal principal);

    ResponseEntity<?> revokeVoucher(Long cartId, Principal principal);

    List<VoucherResponse> getListVouchersForAll();

    VoucherResponse getVoucherDetail(Long id);
    void updateVoucher(Long id);
    void updateAllVoucher();
}
