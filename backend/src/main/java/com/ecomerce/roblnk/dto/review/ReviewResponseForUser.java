package com.ecomerce.roblnk.dto.review;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponseForUser {
    private Long id;
    private Long orderItemId;
    private Long productId;
    private String productName;
    private Long productItemId;
    private String size;
    private String color;
    private Long userId;
    private String userEmail;
    private Integer rating;
    private String imageFeedback;
    private String feedback;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updatedAt;

}
