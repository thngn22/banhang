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

    @Mapping(source = "_default", target = "_default")
    @Mapping(source = "id", target = "addressInfor.id")
    @Mapping(source = "active", target = "active")
    @Mapping(source = "city", target = "addressInfor.city")
    @Mapping(source = "district", target = "addressInfor.district")
    @Mapping(source = "ward", target = "addressInfor.ward")
    @Mapping(source = "address", target = "addressInfor.address")
    UserAddressResponse toUserAddressResponse(Address userAddress);
    List<UserAddressResponse> toListUserAddressResponse(List<Address> userAddresses);
    AddressDTO toUserAddressDTO(Address address);

    Address toAddressEntity(UserAddressRequest userAddressRequest);
}
