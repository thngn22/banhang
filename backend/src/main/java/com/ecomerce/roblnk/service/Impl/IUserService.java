package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.order.OrderItemDTO;
import com.ecomerce.roblnk.dto.order.OrderResponsev2;
import com.ecomerce.roblnk.dto.order.OrdersResponse;
import com.ecomerce.roblnk.dto.review.ReviewRequest;
import com.ecomerce.roblnk.dto.review.ReviewResponseForUser;
import com.ecomerce.roblnk.dto.user.*;
import com.ecomerce.roblnk.mapper.OrderMapper;
import com.ecomerce.roblnk.mapper.ReviewMapper;
import com.ecomerce.roblnk.mapper.UserMapper;
import com.ecomerce.roblnk.model.*;
import com.ecomerce.roblnk.repository.*;
import com.ecomerce.roblnk.security.JwtService;
import com.ecomerce.roblnk.service.EmailService;
import com.ecomerce.roblnk.service.ReviewService;
import com.ecomerce.roblnk.service.UserService;
import com.ecomerce.roblnk.util.Status;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

import static com.ecomerce.roblnk.constants.ErrorMessage.*;
import static com.ecomerce.roblnk.util.Status.HOAN_TAT;

@Service("IUserService")
@AllArgsConstructor
public class IUserService implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserAddressRepository userAddressRepository;
    private final AddressRepository addressRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final ProductItemRepository productItemRepository;
    private final StatusOrderRepository statusOrderRepository;
    private final EmailService emailService;
    private final ProductRepository productRepository;
    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Override
    public UserDetailResponse getDetailUser(Long userId) {
        var user = userRepository.findById(userId).orElseThrow(() ->
                new UsernameNotFoundException("User not found with ID: " + userId));
        return userMapper.toUserDetailResponse(user);
    }

    @Override
    public User findUserProfileByJwt(String jwt) {
        String email = jwtService.getEmailFromToken(jwt);
        return userRepository.findByEmail(email).orElseThrow(()
                -> new UsernameNotFoundException("User not found!"));
    }


    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        var userList = userRepository.findAll();
        return userMapper.toListUserResponse(userList);
    }

    @Override
    public ResponseEntity<?> editInformation(Principal connectedUser, EditUserProfileRequest request) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setDob(request.getDob());
            user.setAvatar(request.getAvatar());
            userRepository.save(user);
            return ResponseEntity.ok("successfully saved!");
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any user! Something went wrong...");
    }

    @Override
    public ResponseEntity<?> getUserAddress(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var userAddress = userAddressRepository.findAllByUser_Email(user.getEmail());
        var addressList = userMapper.toListUserAddressResponse(userAddress);
        return ResponseEntity.ok(addressList);
    }

    @Override
    public ResponseEntity<?> addUserAddress(Principal connectedUser, UserAddressRequest userAddressRequest) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var address = userMapper.toAddressEntity(userAddressRequest);
        var user_address = userAddressRepository.findAllByUser_Email(user.getEmail());
        UserAddress userAddress = new UserAddress();
        userAddress.setUser(user);
        userAddress.setAddress(address);
        userAddress.setDefault(false);
        user_address.add(userAddress);
        addressRepository.save(address);
        userAddressRepository.save(userAddress);
        return ResponseEntity.ok("Added new address!");
    }

    @Override
    public ResponseEntity<?> updateUserAddress(Principal connectedUser, Long id, UserAddressRequest userUpdateAddressRequest) {
        var addressId = addressRepository.findById(id);
        if (addressId.isPresent()) {
            addressId.get().setCity(userUpdateAddressRequest.getCity());
            addressId.get().setStreetAddress(userUpdateAddressRequest.getStreetAddress());
            addressId.get().setZipCode(userUpdateAddressRequest.getZipCode());
            addressRepository.save(addressId.get());
            return ResponseEntity.ok("Updated address!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found address to update!");
        }
    }

    @Override
    public ResponseEntity<?> deleteUserAddress(Principal connectedUser, Long id) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var userAddresses = userAddressRepository.findUserAddressByAddress_IdAndUser_Email(id, user.getEmail());
        if (userAddresses.isPresent()) {
            System.out.println(userAddresses.get().getId());
            userAddressRepository.delete(userAddresses.get());
            return ResponseEntity.ok("Deleted address!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found address to delete!");
        }
    }

    @Override
    public ResponseEntity<?> deActiveOrActiveUser(Principal connectedUser, Long id) {
        var admin = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid account, please login again!");
        }
        var user = userRepository.findById(id);
        if (user.isPresent()) {
            if (user.get().isActive()) {
                user.get().setActive(false);
                userRepository.save(user.get());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("Deactive user successfully!");
            } else {
                user.get().setActive(true);
                userRepository.save(user.get());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("Active user successfully!");
            }
        } else
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Something went wrong, user is not existed!");

    }

    @Override
    public ResponseEntity<?> createUser(Principal principal, UserCreateRequest userCreateRequest) {
        var admin = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid account, please login again!");
        }
        var existedUser = userRepository.findByEmail(userCreateRequest.getEmail());
        if (existedUser.isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body(EMAIL_IN_USE);
        var role = new HashSet<Role>();
        role.add(roleRepository.findRoleByRole(EnumRole.ROLE_USER.name()));
        var user = new User();
        user.setFirstName(userCreateRequest.getFirstName());
        user.setLastName(userCreateRequest.getLastName());
        user.setEmail(userCreateRequest.getEmail());
        user.setRoles(role);
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));
        user.setActive(true);
        user.setEmailActive(true);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.builder()
                .statusCode(200)
                .message("Created user successfully")
                .description("Successfully")
                .timestamp(new Date(System.currentTimeMillis()))
                .build());

    }

    @Override
    public OrdersResponse getUserHistoryOrderForAdmin(Principal connectedUser, Long id) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findById(id);
            if (userOrders.isPresent()) {
                var orderDetail = orderMapper.toOrderResponse(userOrders.get());
                for (OrderItemDTO orderItemDTO : orderDetail.getOrderItems()) {
                    var productItem = productItemRepository.findById(orderItemDTO.getProductItemId()).orElseThrow();
                    if (productItem.getProductConfigurations().get(0).getVariationOption().getVariation().getName().startsWith("M")) {
                        orderItemDTO.setColor(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                        orderItemDTO.setSize(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                    } else {
                        orderItemDTO.setColor(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                        orderItemDTO.setSize(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                    }
                }
                return orderDetail;

            }
        }
        return null;
    }

    @Override
    public List<OrderResponsev2> getAllUserHistoryOrders(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findAllByUser_Email(user.getEmail());
            if (userOrders != null) {
                return orderMapper.toOrderResponsev2s(userOrders);
            }
        }
        return null;
    }

    @Override
    public List<OrderResponsev2> getAllUserHistoryOrdersForAdmin(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findAll();
            return orderMapper.toOrderResponsev2s(userOrders);
        }
        return null;
    }

    @Override
    public String ratingProduct(Principal connectedUser, Long id, List<ReviewRequest> reviewRequests) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findOrdersByUser_EmailAndId(user.getEmail(), id);
            if (userOrders.isPresent()) {
                while (!reviewRequests.isEmpty()) {
                    var review = reviewRequests.get(0);
                    boolean flag = false;
                    var orderItems = orderItemRepository.findAllByOrders_Id(userOrders.get().getId());
                    loop:
                    {
                        for (OrderItem orderItem : orderItems) {
                            if (orderItem.getId().equals(review.getOrderItemId()) &&
                                    userOrders.get().getStatusOrder().getOrderStatus().equals(HOAN_TAT.toString())) {
                                flag = true;
                                break loop;
                            }
                        }
                    }
                    System.out.println(userOrders.get().getOrderItems().size());
                    if (flag) {
                        for (OrderItem orderItem : orderItems) {
                            if (orderItem.getId().equals(review.getOrderItemId()) &&
                                    userOrders.get().getStatusOrder().getOrderStatus().equals(HOAN_TAT.toString())) {
                                Review review1 = new Review();
                                review1.setRating(review.getRatingStars());
                                review1.setUser(user);
                                review1.setFeedback(review.getFeedback());
                                review1.setImageFeedback(reviewService.getURLPictureAndUploadToCloudinaryReview(review.getImageFeedback()));
                                review1.setCreatedAt(new Date(System.currentTimeMillis()));
                                review1.setUpdatedAt(new Date(System.currentTimeMillis()));
                                review1.setOrderItem(orderItem);
                                orderItem.setReview(review1);
                                try {
                                    var product = productRepository.findById(review.getProductId()).orElseThrow();
                                    review1.setProduct(product);
                                    if (product.getRating().equals(0.0)) {
                                        product.setRating((double) review.getRatingStars());
                                    } else {
                                        var rating = (double) (product.getRating() * product.getReviews().size() + review.getRatingStars()) / (product.getReviews().size() + 1);
                                        product.setRating(rating);
                                    }
                                    product.getReviews().add(review1);
                                    reviewRepository.save(review1);
                                    productRepository.save(product);
                                    orderItemRepository.save(orderItem);
                                } catch (Exception e) {
                                    return "Product not found or has been inactive! Please try again later!";
                                }
                            }
                        }

                    } else {
                        return "Order is not shipped or order item is not available for this user!";
                    }
                    reviewRequests.remove(0);

                }
                return "Thank you for your feedback!";
            } else
                return "Order not found!";
        } else
            return "You're not valid to rate this product!";

    }

    @Override
    public List<ReviewResponseForUser> getRatingProduct(Principal connectedUser, Long id) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userReviews = reviewService.findAllByUser_Email(user.getEmail());
            List<Review> reviews = new ArrayList<>();
            for (Review review : userReviews) {
                if (review.getOrderItem().getOrders().getId().equals(id)) {
                    reviews.add(review);
                }
            }

            var reviewResponse = reviewMapper.toReviewResponseForUsers(reviews);
            var userOrders = orderRepository.findOrdersByUser_EmailAndId(user.getEmail(), id);
            var orderDetail = orderMapper.toOrderResponse(userOrders.get());
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

            for (int i = 0; i < reviewResponse.size(); i++){
                reviewResponse.get(i).setColor(orderDetail.getOrderItems().get(i).getColor());
                reviewResponse.get(i).setSize(orderDetail.getOrderItems().get(i).getSize());
            }
            return reviewResponse;
        } else return null;
    }

    //Detail
    @Override
    public OrdersResponse getUserHistoryOrderForUser(Principal connectedUser, Long id) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findOrdersByUser_EmailAndId(user.getEmail(), id);
            if (userOrders.isPresent()) {
                var orderDetail = orderMapper.toOrderResponse(userOrders.get());
                for (OrderItemDTO orderItemDTO : orderDetail.getOrderItems()) {
                    var productItem = productItemRepository.findById(orderItemDTO.getProductItemId()).orElseThrow();
                    if (productItem.getProductConfigurations().get(0).getVariationOption().getVariation().getName().startsWith("M")) {
                        orderItemDTO.setColor(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                        orderItemDTO.setSize(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                    } else {
                        orderItemDTO.setColor(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                        orderItemDTO.setSize(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                    }
                }
                return orderDetail;

            }
        }
        return null;
    }

    @Override
    public String cancelOrdersFromUser(Principal connectedUser, Long id) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findOrdersByUser_EmailAndId(user.getEmail(), id);
            if (userOrders.isPresent()) {
                if (userOrders.get().getStatusOrder().getOrderStatus().equals(Status.DANG_CHO_XU_LY.toString())
                        || userOrders.get().getStatusOrder().getOrderStatus().equals(Status.DANG_XU_LY.toString())) {
                    var status = statusOrderRepository.findStatusOrderByOrderStatusContaining(Status.DA_BI_NGUOI_DUNG_HUY.toString()).orElseThrow();
                    System.out.println(status.getOrderStatus());
                    status.getOrders().add(userOrders.get());
                    statusOrderRepository.save(status);
                    userOrders.get().setStatusOrder(status);
                    orderRepository.save(userOrders.get());
                    return "Successfully canceled this order!";
                }
                if (userOrders.get().getStatusOrder().getOrderStatus().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString())) {
                    return "This order already canceled!";
                } else return "Order is deliveried, you don't have permission to cancel it!";
            } else return "Did not found any order, please try again!";
        }
        return "You don't have permission to access this resource!";
    }

    @Override
    public String confirmOrdersFromUser(Principal connectedUser, Long id) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findById(id);
            if (userOrders.isPresent()) {
                if (userOrders.get().getStatusOrder().getOrderStatus().equals(Status.DA_GIAO_HANG.toString())
                        || userOrders.get().getStatusOrder().getOrderStatus().equals(Status.CHO_XAC_NHAN.toString())) {
                    var status = statusOrderRepository.findStatusOrderByOrderStatusContaining(HOAN_TAT.toString()).orElseThrow();
                    System.out.println(status.getOrderStatus());
                    status.getOrders().add(userOrders.get());
                    statusOrderRepository.save(status);
                    userOrders.get().setStatusOrder(status);
                    orderRepository.save(userOrders.get());
                    return "Successfully confirm this order!";
                }
                if (userOrders.get().getStatusOrder().getOrderStatus().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString())) {
                    return "This order already canceled!";
                } else return "Order is deliveried, you don't have permission to cancel it!";
            } else return "Did not found any order, please try again!";
        }
        return "You don't have permission to access this resource!";
    }

    @Override
    public String changeStatusOrderByAdmin(Principal connectedUser, Long orderId, String status) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null) {
            var userOrders = orderRepository.findById(orderId);
            if (userOrders.isPresent()) {
                boolean flag = false;
                boolean sendMail = false;
                switch (status) {
                    case "DANG_XU_LY" -> {
                        if (userOrders.get().getStatusOrder().getOrderStatus().equals("DANG_CHO_XU_LY")) {
                            flag = true;
                        }
                    }
                    case "DANG_VAN_CHUYEN" -> {
                        if (userOrders.get().getStatusOrder().getOrderStatus().equals("DANG_CHO_XU_LY")
                                || userOrders.get().getStatusOrder().getOrderStatus().equals("DANG_XU_LY")) {
                            flag = true;
                        }
                    }
                    case "DA_GIAO_HANG" -> {
                        if (userOrders.get().getStatusOrder().getOrderStatus().equals("DANG_VAN_CHUYEN")) {
                            flag = true;
                            sendMail = true;
                        }

                    }
                    case "DA_BI_HE_THONG_HUY" -> {
                        if (!userOrders.get().getStatusOrder().getOrderStatus().equals("DA_BI_NGUOI_DUNG_HUY")
                                && !userOrders.get().getStatusOrder().getOrderStatus().equals("HOAN_TAT")) {
                            flag = true;
                        }

                    }
                    case "DA_BI_NGUOI_DUNG_HUY" -> {
                        if (!userOrders.get().getStatusOrder().getOrderStatus().equals("DA_BI_HE_THONG_HUY")
                                && !userOrders.get().getStatusOrder().getOrderStatus().equals("HOAN_TAT")) {
                            flag = true;
                        }

                    }
                    case "BI_TU_CHOI" -> {
                        if (!userOrders.get().getStatusOrder().getOrderStatus().equals("HOAN_TAT")) {
                            flag = true;
                        }

                    }
                    case "HOAN_TAT" -> {
                        if (userOrders.get().getStatusOrder().getOrderStatus().equals("DA_GIAO_HANG")
                                || (userOrders.get().getStatusOrder().getOrderStatus().equals("CHO_XAC_NHAN"))) {
                            flag = true;
                        }

                    }
                }
                if (flag) {
                    var statusOrder = statusOrderRepository.findStatusOrderByOrderStatusContaining(status).orElseThrow();
                    System.out.println(statusOrder.getOrderStatus());
                    statusOrder.getOrders().add(userOrders.get());
                    statusOrderRepository.save(statusOrder);
                    userOrders.get().setStatusOrder(statusOrder);
                    orderRepository.save(userOrders.get());
                    var orderDetail = orderMapper.toOrderResponse(userOrders.get());
                    for (OrderItemDTO orderItemDTO : orderDetail.getOrderItems()) {
                        var productItem = productItemRepository.findById(orderItemDTO.getProductItemId()).orElseThrow();
                        if (productItem.getProductConfigurations().get(0).getVariationOption().getVariation().getName().startsWith("M")) {
                            orderItemDTO.setColor(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                            orderItemDTO.setSize(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                        } else {
                            orderItemDTO.setColor(productItem.getProductConfigurations().get(1).getVariationOption().getValue());
                            orderItemDTO.setSize(productItem.getProductConfigurations().get(0).getVariationOption().getValue());
                        }
                    }
                    var userEmail = orderDetail.getUser().getEmail();
                    var name = orderDetail.getUser().getFirstName() + " " + orderDetail.getUser().getLastName();
                    var shippingTime = orderDetail.getDelivery().getEstimatedShippingTime();
                    var orderDate = orderDetail.getCreatedAt();
                    var orderItems = orderDetail.getOrderItems();
                    var orderEstimateDate = new Date(orderDate.getTime() + (1000 * 60 * 60 * 24) * orderDetail.getDelivery().getEstimatedShippingTime());
                    if (sendMail) {
                        Context context = new Context();
                        context.setVariable("userEmail", userEmail);
                        context.setVariable("userName", name);
                        context.setVariable("orders", orderDetail);
                        context.setVariable("orderItems", orderItems);
                        context.setVariable("shippingTime", shippingTime);
                        context.setVariable("orderDate", orderDate);
                        context.setVariable("orderEstimateDate", orderEstimateDate);
                        emailService.sendEmailWithHtmlTemplate(userEmail, "Xác nhận hoàn tất đơn hàng!", "confirm-order", context);
                    }
                    return "Successfully updated status of this order!";
                }
                if (userOrders.get().getStatusOrder().getOrderStatus().equals(Status.DA_BI_NGUOI_DUNG_HUY.toString())) {
                    return "This order already canceled!";
                } else return "Status can not be changed!";
            } else return "Did not found any order, please try again!";
        }
        return "You don't have permission to access this resource!";
    }

    @Override
    public ResponseEntity<?> findInformationUser(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var userInformation = userMapper.toUserProfileResponse(user);
        return ResponseEntity.ok(userInformation);
    }
}
