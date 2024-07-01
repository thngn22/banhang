package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.voucher.VoucherResponse;
import com.ecomerce.roblnk.model.Voucher;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VoucherMapper {

    VoucherResponse toVoucherResponse(Voucher voucher);
    List<VoucherResponse> toVoucherResponseList(List<Voucher> voucherList);
}
