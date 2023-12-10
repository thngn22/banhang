package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.order.OrderResponsev2;
import com.ecomerce.roblnk.dto.order.OrdersResponse;
import com.ecomerce.roblnk.dto.review.ReviewRequest;
import com.ecomerce.roblnk.dto.review.ReviewResponseForUser;
import com.ecomerce.roblnk.dto.user.*;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;

public interface UserService {
    UserDetailResponse getDetailUser(Long userId) throws UserException;
    User findUserProfileByJwt(String jwt) throws UserException;
    Page<User> getAllUsers(Pageable pageable);
    ResponseEntity<?> findInformationUser(Principal connectedUser);
    List<UserResponse> getAllUsers();

    ResponseEntity<?> editInformation(Principal connectedUser, EditUserProfileRequest request);

    ResponseEntity<?> getUserAddress(Principal connectedUser);

    ResponseEntity<?> addUserAddress(Principal connectedUser, UserAddressRequest userAddressRequest);

    ResponseEntity<?> updateUserAddress(Principal connectedUser, Long id, UserAddressRequest userUpdateAddressRequest);

    ResponseEntity<?> deleteUserAddress(Principal connectedUser, Long id);

    ResponseEntity<?> deActiveOrActiveUser(Principal connectedUser, Long id);

    ResponseEntity<?> createUser(Principal principal, UserCreateRequest userCreateRequest);

    OrdersResponse getUserHistoryOrderForAdmin(Principal connectedUser, Long id);

    List<OrderResponsev2> getAllUserHistoryOrders(Principal connectedUser);

    OrdersResponse getUserHistoryOrderForUser(Principal connectedUser, Long id);

    String cancelOrdersFromUser(Principal connectedUser, Long id);
    String confirmOrdersFromUser(Principal connectedUser, Long id);

    String changeStatusOrderByAdmin(Principal connectedUser, Long orderId, String status);

    List<OrderResponsev2> getAllUserHistoryOrdersForAdmin(Principal connectedUser);

    String ratingProduct(Principal connectedUser, Long id, List<ReviewRequest> reviewRequests);

    List<ReviewResponseForUser> getRatingProduct(Principal connectedUser, Long id);
}
