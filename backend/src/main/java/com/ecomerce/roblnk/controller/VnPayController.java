package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.order.OrderItemDTO;
import com.ecomerce.roblnk.mapper.OrderMapper;
import com.ecomerce.roblnk.model.OrderItem;
import com.ecomerce.roblnk.model.StatusOrder;
import com.ecomerce.roblnk.repository.OrderRepository;
import com.ecomerce.roblnk.repository.ProductItemRepository;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.repository.StatusOrderRepository;
import com.ecomerce.roblnk.service.EmailService;
import com.ecomerce.roblnk.service.ProductItemService;
import com.ecomerce.roblnk.util.Side;
import com.ecomerce.roblnk.util.Status;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.thymeleaf.context.Context;

import java.util.Date;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/vnpay")
public class VnPayController {

    private final VnPayService vnPayService;
    private final OrderRepository orderRepository;
    private final StatusOrderRepository statusOrderRepository;
    private final ProductItemService productItemService;
    private final ProductRepository productRepository;
    private final ProductItemRepository productItemRepository;
    private final EmailService emailService;
    private final OrderMapper orderMapper;

    @GetMapping("/submit_order")
    public String submitOrder(@RequestParam("amount") int orderTotal,
                              @RequestParam("order_infor") String orderInfo,
                              HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        System.out.println("Controller: " + vnpayUrl);
        return "redirect:" + vnpayUrl;
    }

    @GetMapping("/payment")
    public String refund(HttpServletRequest request, Model model) {
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice1 = request.getParameter("vnp_Amount");
        String totalPrice = totalPrice1.substring(0, totalPrice1.length() - 2);
        System.out.println(totalPrice1);
        System.out.println(totalPrice);
        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);
        model.addAttribute("clientURL", Side.CLIENT_SITE_URL_ORDER_HISTORY);
        var order = orderRepository.findById(Long.valueOf(orderInfo)).orElseThrow();
        if (paymentStatus == 1 || paymentStatus == 0) {
            var orderDetail = orderMapper.toOrderResponse(order);
            for (OrderItemDTO orderItemDTO : orderDetail.getOrderItems()) {
                var productItem = productItemRepository.findById(orderItemDTO.getProductItemId()).orElseThrow();
                if (productItem.getProductConfigurations().get(0).getVariationOption().getVariation().getName().startsWith("M")) {
                    orderItemDTO.setColor(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                    orderItemDTO.setSize(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                } else if (productItem.getProductConfigurations().get(1).getVariationOption().getVariation().getName().startsWith("M")) {
                    orderItemDTO.setColor(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                    orderItemDTO.setSize(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                }
            }
            var userEmail = orderDetail.getUser().getEmail();
            var name = orderDetail.getUser().getFirstName() + " " + orderDetail.getUser().getLastName();
            var shippingTime = orderDetail.getDelivery().getEstimatedShippingTime();
            var orderDate = orderDetail.getCreatedAt();
            var orderItemDTOList = orderDetail.getOrderItems();
            var orderEstimateDate = new Date(orderDate.getTime() + (1000 * 60 * 60 * 24) * orderDetail.getDelivery().getEstimatedShippingTime());
            var note = "";
            var title = "";
            if (orderDetail.getStatusOrder().equals(Status.BI_TU_CHOI.toString())
                    || orderDetail.getStatusOrder().equals(Status.DA_BI_HE_THONG_HUY.toString()) ||
                    orderDetail.getStatusOrder().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString())) {
                title = "Thông báo hủy đơn!";
                note = "We are sorry to notify that your order has been canceled. Reason: " + Status.valueOf(orderDetail.getStatusOrder()).describe();
            } else {
                title = "Đặt hàng thành công!";
                note = "Your order has been confirmed and will be shipped in next " + shippingTime + " days!";
            }
            Context context = new Context();
            context.setVariable("userEmail", userEmail);
            context.setVariable("userName", name);
            context.setVariable("orders", orderDetail);
            context.setVariable("orderItems", orderItemDTOList);
            context.setVariable("note", note);
            context.setVariable("orderDate", orderDate);
            context.setVariable("orderEstimateDate", orderEstimateDate);
            System.out.println(context.getVariable("clientURL"));
            emailService.sendEmailWithHtmlTemplate(userEmail, title, "confirm-order", context);


            if (paymentStatus == 1) {
                return "order_success";
            } else {
                StatusOrder statusOrder = statusOrderRepository.findStatusOrderByOrderStatusContaining(Status.DA_BI_NGUOI_DUNG_HUY.toString()).orElseThrow();
                order.setStatusOrder(statusOrder);
                order = orderRepository.save(order);
                var orderItems = order.getOrderItems();
                for (OrderItem orderItem : orderItems) {
                    var productItem = productItemService.getProductItem(orderItem.getProductItem().getId());
                    productItem.setQuantityInStock(productItem.getQuantityInStock() + orderItem.getQuantity());

                    //Sau nay se fix lai
                    var product = productRepository.findById(orderItem.getProductItem().getProduct().getId()).orElseThrow();
                    product.setSold(product.getSold() - orderItem.getQuantity());
                    productItemRepository.save(productItem);
                    productRepository.save(product);
                }

                return "order_fail";
            }
        } else {
            StatusOrder statusOrder = statusOrderRepository.findStatusOrderByOrderStatusContaining(Status.DA_BI_NGUOI_DUNG_HUY.toString()).orElseThrow();
            order.setStatusOrder(statusOrder);
            orderRepository.save(order);
            var orderItems = order.getOrderItems();
            for (OrderItem orderItem : orderItems) {
                var productItem = productItemService.getProductItem(orderItem.getProductItem().getId());
                productItem.setQuantityInStock(productItem.getQuantityInStock() + orderItem.getQuantity());

                //Sau nay se fix lai
                var product = productRepository.findById(orderItem.getProductItem().getProduct().getId()).orElseThrow();
                product.setSold(product.getSold() - orderItem.getQuantity());
                productItemRepository.save(productItem);
                productRepository.save(product);
            }
            model.addAttribute("path", request.getServletPath());
            model.addAttribute("method", request.getMethod());
            return "error";
        }
    }
}
