package com.ecomerce.roblnk.dto.order;

import com.ecomerce.roblnk.constants.StatusOrder;
import com.ecomerce.roblnk.dto.user.AddressDTO;
import com.ecomerce.roblnk.model.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrdersResponse {
    private Long id;
    private Integer totalPayment;
    private Integer totalItem;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateAt;
    private Long userId;
    private AddressDTO address;
    private PaymentMethodDTO userPaymentMethod;
    private DeliveryDTO delivery;
    private String statusOrder;
    private Integer finalPayment;
    private List<OrderItemDTO> orderItems;
}
