package com.ecomerce.roblnk.dto.voucher;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
public class VoucherRequest {
    @NotNull
    @NotBlank
    private String voucherCode;

    @NotNull
    @NotBlank
    private String name;

    @NotNull
    @Positive
    @Valid
    private Double discountRate;

    @NotNull
    @Positive
    private Integer maximumDiscountValidPrice;

    private Integer minimumCartPrice;

    private Integer quantity;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date startDate;

    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date endDate;
}
