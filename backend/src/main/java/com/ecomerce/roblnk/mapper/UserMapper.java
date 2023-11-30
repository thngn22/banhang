package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.product.ProductDTO;
import com.ecomerce.roblnk.dto.user.*;
import com.ecomerce.roblnk.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "username", target = "userName")
    UserProfileResponse toUserProfileResponse(User user);

    @Mapping(source = "username", target = "userName")
    @Mapping(source = "emailActive", target = "emailActive")
    @Mapping(source = "phoneActive", target = "phoneActive")
    @Mapping(source = "active", target = "active")
    UserDetailResponse toUserDetailResponse(User user);
    @Mapping(source = "default", target = "default")
    UserAddressDTO toUserAddress(UserAddress userAddress);
    List<UserAddressDTO> toUserAddressDTOs(List<UserAddress> userAddresses);

    UserResponse toUserResponse(User user);
    List<UserResponse> toListUserResponse(List<User> userList);
    UserReviewDTO toUserReviewDTO(Review review);
    List<UserReviewDTO> toUserReviewDTOs(List<Review> reviews);

    @Mapping(source = "category.id", target = "categoryId")
    ProductDTO toProductDTO(Product product);

    PaymentMethod toPaymentEntity(UserPaymentRequest userPaymentRequest);

    UserPaymentResponse toPaymentResponse(PaymentMethod paymentMethod);
    List<UserPaymentResponse> toUserPaymentResponses(List<PaymentMethod> paymentMethods);

    List<UserAddressResponse> toListUserAddressResponse(List<UserAddress> userAddresses);

    @Mapping(source = "default", target = "default")
    UserAddressResponse toUserAddressResponse(UserAddress userAddress);
    AddressDTO toUserAddressDTO(Address address);

    Address toAddressEntity(UserAddressRequest userAddressRequest);
}
