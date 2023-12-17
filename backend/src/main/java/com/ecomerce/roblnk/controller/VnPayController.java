package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.model.OrderItem;
import com.ecomerce.roblnk.model.StatusOrder;
import com.ecomerce.roblnk.repository.OrderRepository;
import com.ecomerce.roblnk.repository.ProductItemRepository;
import com.ecomerce.roblnk.repository.ProductRepository;
import com.ecomerce.roblnk.repository.StatusOrderRepository;
import com.ecomerce.roblnk.service.ProductItemService;
import com.ecomerce.roblnk.util.Status;
import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;

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
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);
        var order = orderRepository.findById(Long.valueOf(orderInfo)).orElseThrow();
        if (paymentStatus == 1) {
            return "order_success";
        } else if (paymentStatus == 0) {
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
            return "order_fail";
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
