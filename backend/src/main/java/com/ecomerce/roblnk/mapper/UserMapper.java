package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.product.ProductDTO;
import com.ecomerce.roblnk.dto.user.*;
import com.ecomerce.roblnk.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserProfileResponse toUserProfileResponse(User user);

    @Mapping(source = "emailActive", target = "emailActive")
    @Mapping(source = "phoneActive", target = "phoneActive")
    @Mapping(source = "active", target = "active")
    UserDetailResponse toUserDetailResponse(User user);
    UserResponse toUserResponse(User user);
    List<UserResponse> toListUserResponse(List<User> userList);

    @Mapping(source = "default", target = "default")
    UserAddressResponse toUserAddressResponse(UserAddress userAddress);
    List<UserAddressResponse> toListUserAddressResponse(List<UserAddress> userAddresses);
    AddressDTO toUserAddressDTO(Address address);

    Address toAddressEntity(UserAddressRequest userAddressRequest);
}
