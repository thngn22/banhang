package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.cart.CheckoutRequest;
import com.ecomerce.roblnk.dto.cart.PaymentMethodResponse;
import com.ecomerce.roblnk.dto.cart.UserCart;
import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import com.ecomerce.roblnk.dto.order.OrderItemDTO;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.mapper.CartMapper;
import com.ecomerce.roblnk.mapper.OrderMapper;
import com.ecomerce.roblnk.model.*;
import com.ecomerce.roblnk.repository.*;
import com.ecomerce.roblnk.service.*;
import com.ecomerce.roblnk.util.Status;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.thymeleaf.context.Context;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ICartService implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartItemService cartItemService;
    private final CartMapper cartMapper;
    private final UserRepository userRepository;
    private final ProductItemService productItemService;
    private final PaymentMethodService paymentMethodService;
    private final DeliveryService deliveryService;
    private final StatusOrderRepository statusOrderRepository;
    private final UserPaymentMethodService userPaymentMethodService;
    private final UserPaymentMethodRepository userPaymentMethodRepository;
    private final AddressRepository addressRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final EmailService emailService;
    private final ProductItemRepository productItemRepository;
    private final ProductRepository productRepository;

    @Override
    public ResponseEntity<?> getUserCart(Principal principal) {
        var user = userRepository.findByEmail(principal.getName());
        if (user.isPresent()) {
            var cart = user.get().getCart();
            if (cart != null) {
                UserCart userCart = cartMapper.toUserCart(cart);
                List<CartItemDTO> list = new ArrayList<>();
                for (CartItemDTO cartItemDTO : userCart.getCartItems()) {
                    if (cartItemDTO.getQuantity() > 0) {
                        list.add(cartItemDTO);
                    }
                }
                userCart.setCartItems(list);
                return ResponseEntity.status(HttpStatus.OK).body(userCart);

            } else return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description("You don't have any items in cart!")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());

        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                .statusCode(404)
                .message(String.valueOf(HttpStatus.NOT_FOUND))
                .description(EMAIL_NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build());
    }

    @Override
    public UserCart getUserCartv2(Principal principal) {
        var user = userRepository.findByEmail(principal.getName());
        if (user.isPresent()) {
            var cart = user.get().getCart();
            if (cart != null) {
                UserCart userCart = cartMapper.toUserCart(cart);
                List<CartItemDTO> list = new ArrayList<>();
                for (CartItemDTO cartItemDTO : userCart.getCartItems()) {
                    if (cartItemDTO.getQuantity() > 0) {
                        list.add(cartItemDTO);
                    }
                }
                userCart.setCartItems(list);
                return userCart;

            } else return null;
        }
        return null;
    }

    @Override
    public ResponseEntity<?> editUserCart(Principal principal, @Valid List<CartItemEditRequest> list) {
        var user = userRepository.findByEmail(principal.getName());
        int totalPrice = 0;
        int totalQuantity = 0;
        if (user.isPresent()) {
            var userCart = user.get().getCart();

            for (CartItemEditRequest cartItemEditRequest : list) {
                var productItem = productItemService.getProductItem(cartItemEditRequest.getProductItemId());
                if (productItem != null) {
                    if (productItem.isActive()) {
                        var cartItemsExisted = cartItemRepository.findAllByCart_Id(userCart.getId());
                        if (!cartItemsExisted.isEmpty()) {
                            boolean flag = false;
                            loop:
                            {
                                for (CartItem cartItem : cartItemsExisted) {
                                    if (cartItem.getProductItem().getId().equals(productItem.getId())) {
                                        flag = true;
                                        break loop;
                                    }
                                }
                            }
                            if (flag) {
                                miniLoop:
                                {
                                    for (CartItem cartItem : cartItemsExisted) {
                                        if (cartItem.getProductItem().getId().equals(productItem.getId())) {
                                            if (cartItem.getQuantity() + cartItemEditRequest.getQuantity() > productItem.getQuantityInStock()) {
                                                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                                        .statusCode(403)
                                                        .message(String.valueOf(HttpStatus.FORBIDDEN))
                                                        .description("Quantity is more than in stock!")
                                                        .timestamp(new Date(System.currentTimeMillis()))
                                                        .build());
                                            }
                                            if (cartItem.getQuantity() + cartItemEditRequest.getQuantity() <= 0) {
                                                cartItem.setQuantity(0);
                                                cartItem.setTotalPrice(0);
                                            } else {
                                                cartItem.setQuantity(cartItem.getQuantity() + cartItemEditRequest.getQuantity());
                                                cartItem.setTotalPrice(cartItem.getPrice() * cartItem.getQuantity());
                                            }
                                            cartItem.setPrice(productItem.getPrice());
                                            cartItem = cartItemRepository.save(cartItem);
                                            System.out.println("Gia: " + cartItem.getPrice());
                                            System.out.println("So luong: " + cartItem.getQuantity());
                                            System.out.println(" ");
                                            break miniLoop;
                                        }
                                    }
                                }
                            } else {
                                CartItem cartItem = new CartItem();
                                cartItem.setCart(userCart);
                                cartItem.setProductItem(productItem);
                                cartItem.setPrice(productItem.getPrice());
                                if (cartItemEditRequest.getQuantity() > productItem.getQuantityInStock()) {
                                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                            .statusCode(403)
                                            .message(String.valueOf(HttpStatus.FORBIDDEN))
                                            .description("Quantity is more than in stock!")
                                            .timestamp(new Date(System.currentTimeMillis()))
                                            .build());
                                }
                                if (cartItemEditRequest.getQuantity() <= 0) {
                                    cartItem.setQuantity(0);
                                    cartItem.setTotalPrice(0);
                                } else {
                                    cartItem.setQuantity(cartItemEditRequest.getQuantity());
                                    cartItem.setTotalPrice(productItem.getPrice() * cartItemEditRequest.getQuantity());
                                }
                                cartItem = cartItemRepository.save(cartItem);
                                userCart.getCartItems().add(cartItem);
                            }
                        } else {
                            CartItem cartItem = new CartItem();
                            cartItem.setCart(userCart);
                            cartItem.setProductItem(productItem);
                            cartItem.setPrice(productItem.getPrice());
                            if (cartItemEditRequest.getQuantity() > productItem.getQuantityInStock()) {
                                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                        .statusCode(403)
                                        .message(String.valueOf(HttpStatus.FORBIDDEN))
                                        .description("Quantity is more than in stock!")
                                        .timestamp(new Date(System.currentTimeMillis()))
                                        .build());
                            }
                            if (cartItemEditRequest.getQuantity() <= 0) {
                                cartItem.setQuantity(0);
                                cartItem.setTotalPrice(0);
                            } else {
                                cartItem.setQuantity(cartItemEditRequest.getQuantity());
                                cartItem.setTotalPrice(productItem.getPrice() * cartItemEditRequest.getQuantity());
                            }
                            cartItemRepository.save(cartItem);
                            userCart.getCartItems().add(cartItem);
                        }

                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                .statusCode(403)
                                .message(String.valueOf(HttpStatus.FORBIDDEN))
                                .description("Unavailable to add this product! Out of stock!")
                                .timestamp(new Date(System.currentTimeMillis()))
                                .build());
                    }
                } else
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                            .statusCode(403)
                            .message(String.valueOf(HttpStatus.FORBIDDEN))
                            .description("Product not found. Invalid to add this product!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build());


            }
            for (CartItem cartItem : userCart.getCartItems()) {
                totalQuantity += cartItem.getQuantity();
                totalPrice += cartItem.getTotalPrice();
            }
            userCart.setTotalItem(totalQuantity);
            userCart.setTotalPrice(totalPrice);
            cartRepository.save(userCart);
            return ResponseEntity.status(HttpStatus.OK).body(ErrorResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description("Update cart successfully")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(EMAIL_NOT_FOUND)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
    }

    @Override
    public ResponseEntity<?> checkoutCart(Principal principal, CheckoutRequest list, HttpServletRequest request, RedirectAttributes redirectAttributes) throws URISyntaxException {
        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (user != null) {
            if (list.getCartItemId().isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        ErrorResponse.builder()
                                .statusCode(403)
                                .message("Not thing to check out, please add shoes to cart first!")
                                .description("Not thing to check out, please add shoes to cart first!")
                                .timestamp(new Date(System.currentTimeMillis()))
                                .build()
                );
            }
            //COD
            var payments = paymentMethodService.getAllPaymentMethod(principal);
            boolean flag = false;
            loop:
            {

                for (PaymentMethodResponse paymentMethodResponse : payments) {
                    if (paymentMethodResponse.getId().equals(list.getPaymentMethodId())) {
                        flag = true;
                        break loop;
                    }
                }
            }
            if (!flag) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        ErrorResponse.builder()
                                .statusCode(403)
                                .message("Payment method invalid! Please try another payment method!")
                                .description("Not thing to check out, please add shoes to cart first!")
                                .timestamp(new Date(System.currentTimeMillis()))
                                .build()
                );
            } else {
                int count = 0;
                for (Long id : list.getCartItemId()) {
                    var cartItem = cartItemService.getCartItem(id);
                    if (cartItem != null) {
                        count += cartItem.getQuantity();
                    } else
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                                ErrorResponse.builder()
                                        .statusCode(403)
                                        .message("Cart item is not valid, please add some shoes to your cart first!")
                                        .description("Not thing to check out, please add shoes to cart first!")
                                        .timestamp(new Date(System.currentTimeMillis()))
                                        .build()
                        );
                }
                if (count == 0) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                            ErrorResponse.builder()
                                    .statusCode(403)
                                    .message("Cart empty, please add some shoes to check out!")
                                    .description("Not thing to check out, please add shoes to cart first!")
                                    .timestamp(new Date(System.currentTimeMillis()))
                                    .build()
                    );
                }
                //COD

                var paymentMethod = paymentMethodService.getPaymentEntity(list.getPaymentMethodId());
                var delivery = deliveryService.getDeliveryEntity(list.getDeliveryId());
                if (delivery == null) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                            ErrorResponse.builder()
                                    .statusCode(403)
                                    .message("Please choose one of delivery type before place an orders!")
                                    .description("Not thing to check out, please add shoes to cart first!")
                                    .timestamp(new Date(System.currentTimeMillis()))
                                    .build()
                    );
                }

                Orders orders = new Orders();
                int totalPayment = 0;
                int totalItem = 0;
                UserAddress userAddress = new UserAddress();
                List<OrderItem> orderItems = new ArrayList<>();
                var userCart = getUserCartv2(principal);
                boolean flagValid = true;
                valid:
                {
                    for (Long id : list.getCartItemId()) {
                        OrderItem orderItem = new OrderItem();
                        var cartItem = cartItemService.getCartItem(id);
                        if (cartItem.getQuantity() > cartItem.getProductItem().getQuantityInStock()) {
                            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                                    ErrorResponse.builder()
                                            .statusCode(403)
                                            .message("Oopss... One of the items in your cart has a larger quantity than it actually has. Please edit your quantity and try again!")
                                            .description("Not thing to check out, please add shoes to cart first!")
                                            .timestamp(new Date(System.currentTimeMillis()))
                                            .build()
                            );
                        }
                        List<CartItem> cartItems = new ArrayList<>();
                        cartItems.add(cartItem);
                        if (cartItem.getCart().getId().equals(userCart.getId())) {
                            orderItem.setCartItems(cartItems);
                            orderItem.setPrice(cartItem.getPrice());
                            orderItem.setQuantity(cartItem.getQuantity());
                            orderItem.setTotalPrice(cartItem.getTotalPrice());
                            orderItem.setCreatedAt(new Date(System.currentTimeMillis()));
                            orderItem.setProductItem(cartItem.getProductItem());
                            totalItem += cartItem.getQuantity();
                            totalPayment += cartItem.getTotalPrice();
                        } else {
                            flagValid = false;
                            break valid;
                        }
                        orderItem.setOrders(orders);
                        orderItems.add(orderItem);
                    }
                }
                if (flagValid) {

                    orders.setTotalItem(totalItem);
                    orders.setTotalPayment(totalPayment);
                    orders.setFinalPayment(totalPayment + delivery.getPrice());
                    var statusOrder = statusOrderRepository.findStatusOrderByOrderStatusContaining(Status.DANG_XU_LY.toString());
                    statusOrder.get().getOrders().add(orders);
                    orders.setStatusOrder(statusOrder.get());
                    orders.setDelivery(delivery);
                    orders.setCreatedAt(new Date(System.currentTimeMillis()));
                    orders.setUpdateAt(new Date(System.currentTimeMillis()));
                    var userPaymentMethod = userPaymentMethodService.getAllUserPaymentMethod(user.getId());
                    boolean addNewPayment = true;
                    addPayment:
                    {
                        for (UserPaymentMethod userPaymentMethod1 : userPaymentMethod) {
                            if (userPaymentMethod1.getPaymentMethod().getId().equals(paymentMethod.getId())) {
                                addNewPayment = false;
                                orders.setUserPaymentMethod(userPaymentMethod1);
                                break addPayment;
                            }
                        }
                    }
                    if (addNewPayment) {
                        UserPaymentMethod userPaymentMethod1 = new UserPaymentMethod();
                        userPaymentMethod1.setPaymentMethod(paymentMethod);
                        userPaymentMethod1.setUser(user);
                        userPaymentMethod1 = userPaymentMethodRepository.save(userPaymentMethod1);
                        userPaymentMethod1.getOrders().add(orders);
                        orders.setUserPaymentMethod(userPaymentMethod1);
                    }
                    Address address = new Address();
                    address.setCity(list.getUserAddressRequestv2().getCity());
                    address.setDistrict(list.getUserAddressRequestv2().getDistrict());
                    address.setWard(list.getUserAddressRequestv2().getWard());
                    address.setAddress(list.getUserAddressRequestv2().getAddress());
                    address = addressRepository.save(address);
                    orders.setAddress(address);
                    orders.setUser(user);
                    orders.setOrderItems(orderItems);
                    userAddress.setDefault(false);
                    userAddress.setUser(user);
                    userAddress.setAddress(address);
                    userAddressRepository.save(userAddress);
                    userRepository.save(user);


                    for (Long id : list.getCartItemId()) {
                        var cartItem = cartItemService.getCartItem(id);
                        if (cartItem.getCart().getId().equals(userCart.getId())) {
                            var productItem = productItemService.getProductItem(cartItem.getProductItem().getId());
                            productItem.setQuantityInStock(productItem.getQuantityInStock() - cartItem.getQuantity());
                            productItemRepository.save(productItem);
                            var product = productRepository.findById(cartItem.getProductItem().getProduct().getId()).orElseThrow();
                            product.setSold(product.getSold() + cartItem.getQuantity());
                            cartItem.setQuantity(0);
                            cartItem.setTotalPrice(0);
                            cartItem.setOrderItem(null);
                            productRepository.save(product);
                            cartItemRepository.save(cartItem);
                        }
                    }
                    var cart = cartRepository.findById(userCart.getId()).get();
                    cart.setTotalItem(cart.getTotalItem() - totalItem);
                    cart.setTotalPrice(cart.getTotalPrice() - totalPayment);
                    cartRepository.save(cart);
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                            ErrorResponse.builder()
                                    .statusCode(403)
                                    .message("Product is not added to cart, please add shoes first!")
                                    .description("Product is not added to cart, please add shoes first!")
                                    .timestamp(new Date(System.currentTimeMillis()))
                                    .build()
                    );
                }
                var orderDetail = orderMapper.toOrderResponse(orders);
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
                if (list.getPaymentMethodId().equals(2L)) {

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
                    emailService.sendEmailWithHtmlTemplate(userEmail, title, "confirm-order", context);
                    return ResponseEntity.status(HttpStatus.OK).body("Order created successfully!");
                }

                //VNPAY
                else {
                    String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                    String redirectURL = baseUrl + "/api/v1/vnpay/submit_order?amount=" + orders.getFinalPayment().toString() + "&order_infor=" + orders.getId().toString();
                    System.out.println(redirectURL);
//                    HttpHeaders headers = new HttpHeaders();
//                    headers.add("Location", redirectURL);
                    return ResponseEntity.status(HttpStatus.CREATED).body(redirectURL);
                }

                //MOMO
            }

        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ErrorResponse.builder()
                            .statusCode(400)
                            .message("Bad request, please login first!")
                            .description("Bad request, please login first!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build()
            );

    }

}
