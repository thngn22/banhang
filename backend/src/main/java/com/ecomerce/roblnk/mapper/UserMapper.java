package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.user.*;
import com.ecomerce.roblnk.model.Address;
import com.ecomerce.roblnk.model.PaymentMethod;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.model.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserProfileResponse toUserProfileResponse(User user);
    UserResponse toUserResponse(User user);
    List<UserResponse> toListUserResponse(List<User> userList);

    PaymentMethod toPaymentEntity(UserPaymentRequest userPaymentRequest);

    UserPaymentResponse toPaymentResponse(PaymentMethod paymentMethod);
    List<UserPaymentResponse> toUserPaymentResponses(List<PaymentMethod> paymentMethods);

    List<UserAddressResponse> toListUserAddressResponse(List<UserAddress> userAddresses);

    @Mapping(source = "default", target = "default")
    UserAddressResponse toUserAddressResponse(UserAddress userAddress);
    AddressDTO toUserAddressDTO(Address address);

    Address toAddressEntity(UserAddressRequest userAddressRequest);
}
