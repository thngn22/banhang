package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.voucher.ApplyVoucherRequest;
import com.ecomerce.roblnk.dto.voucher.EditVoucherRequest;
import com.ecomerce.roblnk.dto.voucher.VoucherRequest;
import com.ecomerce.roblnk.dto.voucher.VoucherResponse;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;

public interface VoucherService {
    List<VoucherResponse> getListVouchers();

    String createVoucher(VoucherRequest voucherRequest);

    String editVoucher(EditVoucherRequest editVoucherRequest);

    String deleteVoucher(Long id);

    ResponseEntity<?> applyVoucher(ApplyVoucherRequest voucherRequest, Principal principal);

    ResponseEntity<?> revokeVoucher(Long cartId, Principal principal);

    List<VoucherResponse> getListVouchersForAll();
}
