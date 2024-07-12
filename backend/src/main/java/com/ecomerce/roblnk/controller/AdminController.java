package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.configuration.GoongConfiguration;
import com.ecomerce.roblnk.dto.cart.UserAddressRequestv2;
import com.ecomerce.roblnk.dto.user.UserCreateRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;
import java.security.Principal;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final UserService userService;
    private final ProductService productService;
    private final StatusService statusService;
    private final AdminService adminService;
    @GetMapping("/user")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getDetailUser(@RequestParam("id") Long id) throws UserException {
        var user = userService.getDetailUser(id);
        if (user != null){
            return ResponseEntity.ok(user);
        }
        else return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(ErrorResponse.builder()
                .statusCode(404)
                .message(String.valueOf(HttpStatus.NOT_FOUND))
                .description(EMAIL_NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build());
    }
    @PostMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> createUser(Principal principal, @RequestBody @Valid UserCreateRequest userCreateRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()){
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body(new InputFieldException(bindingResult).getMessage());
        }
        return userService.createUser(principal, userCreateRequest);
    }
    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getListUser(Principal connectedUser,
                                         @RequestParam(value = "user_id", required = false) Long user_id,
                                         @RequestParam(value = "email", required = false) String email,
                                         @RequestParam(value = "state", required = false) Boolean state,
                                         @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber
                                         ){
        var list =  userService.getAllUsersPaging(connectedUser,user_id, email, state, pageNumber);
        if (list != null) {
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }

    @PostMapping("/users/active")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> deActiveOrActiveUser(Principal connectedUser, @RequestParam("id") Long id){
        return userService.deActiveOrActiveUser(connectedUser, id);
    }

    @GetMapping("/products")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllFilterProduct(@RequestParam(value = "category_id", required = false) Long categoryId,
                                                 @RequestParam(value = "min_price", required = false) String minPrice,
                                                 @RequestParam(value = "max_price", required = false) String maxPrice,
                                                 @RequestParam(value = "search", required = false) String search,
                                                 @RequestParam(value = "sort", required = false, defaultValue = "new_to_old") String sort,
                                                 @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber,
                                                 @RequestParam(value = "flag", required = false, defaultValue = "true") boolean isAdmin
    ){
        var product = productService.getAllProductFilter(categoryId, minPrice, maxPrice, search, sort, pageNumber, isAdmin);
        if (product != null){
            return ResponseEntity.status(HttpStatus.OK).body(product);
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
    @GetMapping("/products/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getDetailProduct(@PathVariable("id") Long id) {
        var product = productService.getDetailProductForAdmin(id);
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(product);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }
    @GetMapping("/orders")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllOrders(Principal connectedUser,
                                          @RequestParam(value = "order_id", required = false) Long order_id,
                                          @RequestParam(value = "email", required = false) String email,
                                          @RequestParam(value = "address", required = false) String address,
                                          @RequestParam(value = "state", required = false) String state,
                                          @RequestParam(value = "payment_method", required = false) Long payment_method,
                                          @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber
                                          ) {
        var userOrders = userService.getAllUserHistoryOrdersForAdmin(connectedUser, order_id, email, address, state, payment_method, pageNumber);
        if (userOrders != null) {
            return ResponseEntity.status(HttpStatus.OK).body(userOrders);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }
    @GetMapping("/orders/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getDetailOrder(Principal connectedUser, @PathVariable("id") Long id) {
        var userOrders = userService.getUserHistoryOrderForAdmin(connectedUser, id);
        if (userOrders != null) {
            return ResponseEntity.status(HttpStatus.OK).body(userOrders);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }

    @PostMapping("/orders/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> changeStatusOrderByAdmin(Principal connectedUser, @PathVariable("id") Long orderId, @Param("status") String status) {
        var userOrders = userService.changeStatusOrderByAdmin(connectedUser, orderId, status);
        if (userOrders != null) {
            return ResponseEntity.status(HttpStatus.OK).body(userOrders);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }

    @GetMapping("/orders/status")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getAllStatus() {
        var statusOrders = statusService.getAllStatusOrder();
        if (statusOrders != null) {
            return ResponseEntity.status(HttpStatus.OK).body(statusOrders);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getRevenue(Principal principal, @RequestParam(value = "from", required = false) String from,
                                        @RequestParam(value = "to", required = false) String to,
                                        @RequestParam(value = "type") String type) throws ParseException {
        var revenue = adminService.getAllRevenue(principal, from ,to, type);
        if (revenue != null) {
            return ResponseEntity.status(HttpStatus.OK).body(revenue);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You do not have permission to access this resource!");
    }

    @GetMapping("/user_address/{id}")
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getDetailUserAddress(@PathVariable("id") Long id, @RequestParam(value = "page_number", required = false, defaultValue = "1") Integer pageNumber){
        var product = userService.getDetailUserAddressForAdmin(id, pageNumber);
        if (product != null) {
            return ResponseEntity.status(HttpStatus.OK).body(product);
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any shoes!");
    }

}
