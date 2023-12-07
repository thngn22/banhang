package com.ecomerce.roblnk.constants;

import com.ecomerce.roblnk.model.Orders;
import com.ecomerce.roblnk.util.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "status_order")
public class StatusOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Orders
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "statusOrder", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Orders> orders = new ArrayList<>();
    private String orderStatus;

    private Status status;
    public String describe() {
        switch (status) {
            case DANG_CHO_XU_LY -> {
                return "Sản phẩm đã được đặt hàng và đang chờ xử lý.";
            }
            case DANG_XU_LY -> {
                return "Sản phẩm đã có ở kho, đang trong quá trình vận chuyển";
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
                return "Đơn hàng bị người dùng từ chối nhận";
            }
            case DA_HOAN_TIEN -> {
                return "Đơn hàng đã được hoàn tiền thành công";
            }
            case YEU_CAU_XAC_MINH_THU_CONG -> {
                return "Đơn hàng bị đánh giá là không rõ địa chỉ giao hàng, vui lòng chỉnh sửa lại thông tin địa chỉ thanh toán";
            }
            case CHO_GIAO_HANG -> {
                return "Đơn hàng đã được vận chuyển đến địa chỉ nhận hàng. Vui lòng kiểm tra điện thoại để nhận cuộc gọi từ Người giao";
            }
            default -> {return "Đơn hàng bị ";}
        }
    }

}

