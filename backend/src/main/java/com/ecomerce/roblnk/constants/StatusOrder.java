package com.ecomerce.roblnk.constants;

import com.ecomerce.roblnk.util.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusOrder {
    private Status status;

    public String describe() {
        switch (status) {
            case DANG_CHO_XU_LY -> {
                return "Sản phẩm đã được đặt hàng và đang chờ xử lý.";
            }
            case HOAN_TAT -> {
                return "Đơn hàng đã hoàn tất.";
            }
            case DA_GIAO_HANG -> {
                return "Sản phẩm đã được giao. " +
                        "Vui lòng kiểm tra đơn hàng khi nhận và hoàn tất xác nhận đã mua hàng!";
            }
            case DA_BI_HE_THONG_HUY -> {
                return "Đơn hàng đã bị hệ thống hủy do phương thức thanh toán không hợp lệ " +
                        "hoặc số lượng hàng tồn kho đủ để vận chuyển";
            }

            case DA_BI_NGUOI_DUNG_HUY -> {
                return "Đơn hàng đã bị người dùng hủy vì các lý do cá nhân";
            }
            case DANG_VAN_CHUYEN -> {
                return "Đơn hàng đang được vận chuyển đến địa chỉ giao hàng.";
            }

            case BI_TU_CHOI -> {
                return "Đơn hàng bị ";
            }
            case DA_HOAN_TIEN -> {
                return "Đơn hàng bị ";
            }
            case TRANH_CHAP -> {
                return "Đơn hàng bị ";
            }
            case YEU_CAU_XAC_MINH_THU_CONG -> {
                return "Đơn hàng bị ";
            }
            default -> {return "Đơn hàng bị ";}
        }
    }
}

