package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.cart.UserCart;
import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.dto.product.ProductItemCartDTO;
import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.model.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:54+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class CartMapperImpl implements CartMapper {

    @Override
    public UserCart toUserCart(Cart cart) {
        if ( cart == null ) {
            return null;
        }

        UserCart userCart = new UserCart();

        userCart.setUserId( cartUserId( cart ) );
        userCart.setId( cart.getId() );
        userCart.setTotalPrice( cart.getTotalPrice() );
        userCart.setTotalItem( cart.getTotalItem() );
        userCart.setCartItems( toCartItemDTOs( cart.getCartItems() ) );

        return userCart;
    }

    @Override
    public CartItemDTO toCartItemDTO(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }

        CartItemDTO cartItemDTO = new CartItemDTO();

        cartItemDTO.setId( cartItem.getId() );
        cartItemDTO.setQuantity( cartItem.getQuantity() );
        cartItemDTO.setPrice( cartItem.getPrice() );
        cartItemDTO.setTotalPrice( cartItem.getTotalPrice() );
        cartItemDTO.setProductItem( toProductItemCartDTO( cartItem.getProductItem() ) );

        return cartItemDTO;
    }

    @Override
    public List<CartItemDTO> toCartItemDTOs(List<CartItem> cartItems) {
        if ( cartItems == null ) {
            return null;
        }

        List<CartItemDTO> list = new ArrayList<CartItemDTO>( cartItems.size() );
        for ( CartItem cartItem : cartItems ) {
            list.add( toCartItemDTO( cartItem ) );
        }

        return list;
    }

    @Override
    public ProductItemCartDTO toProductItemCartDTO(ProductItem productItem) {
        if ( productItem == null ) {
            return null;
        }

        ProductItemCartDTO productItemCartDTO = new ProductItemCartDTO();

        productItemCartDTO.setId( productItem.getId() );
        productItemCartDTO.setProductImage( productItem.getProductImage() );
        productItemCartDTO.setName( productItem.getName() );

        return productItemCartDTO;
    }

    private Long cartUserId(Cart cart) {
        if ( cart == null ) {
            return null;
        }
        User user = cart.getUser();
        if ( user == null ) {
            return null;
        }
        Long id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
