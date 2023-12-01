package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.cart.UserCart;
import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.dto.product.ProductItemCartDTO;
import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.ProductItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(source = "user.id", target = "userId")
    UserCart toUserCart(Cart cart);
    CartItemDTO toCartItemDTO (CartItem cartItem);
    List<CartItemDTO> toCartItemDTOs(List<CartItem> cartItems);

    ProductItemCartDTO toProductItemCartDTO(ProductItem productItem);

}
