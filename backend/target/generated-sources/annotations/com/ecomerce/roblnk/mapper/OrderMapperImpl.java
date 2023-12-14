package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.order.DeliveryDTO;
import com.ecomerce.roblnk.dto.order.OrderItemDTO;
import com.ecomerce.roblnk.dto.order.OrderResponsev2;
import com.ecomerce.roblnk.dto.order.OrdersResponse;
import com.ecomerce.roblnk.dto.order.PaymentMethodDTO;
import com.ecomerce.roblnk.dto.order.UserDTO;
import com.ecomerce.roblnk.dto.user.AddressDTO;
import com.ecomerce.roblnk.model.Address;
import com.ecomerce.roblnk.model.Delivery;
import com.ecomerce.roblnk.model.OrderItem;
import com.ecomerce.roblnk.model.Orders;
import com.ecomerce.roblnk.model.PaymentMethod;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.model.StatusOrder;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.model.UserPaymentMethod;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:53+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrdersResponse toOrderResponse(Orders orders) {
        if ( orders == null ) {
            return null;
        }

        OrdersResponse ordersResponse = new OrdersResponse();

        ordersResponse.setStatusOrder( ordersStatusOrderOrderStatus( orders ) );
        ordersResponse.setId( orders.getId() );
        ordersResponse.setTotalPayment( orders.getTotalPayment() );
        ordersResponse.setTotalItem( orders.getTotalItem() );
        ordersResponse.setCreatedAt( orders.getCreatedAt() );
        ordersResponse.setUpdateAt( orders.getUpdateAt() );
        ordersResponse.setUser( userToUserDTO( orders.getUser() ) );
        ordersResponse.setAddress( addressToAddressDTO( orders.getAddress() ) );
        ordersResponse.setUserPaymentMethod( toPaymentMethodDTO( orders.getUserPaymentMethod() ) );
        ordersResponse.setDelivery( deliveryToDeliveryDTO( orders.getDelivery() ) );
        ordersResponse.setFinalPayment( orders.getFinalPayment() );
        ordersResponse.setOrderItems( toOrderItemDTOs( orders.getOrderItems() ) );

        return ordersResponse;
    }

    @Override
    public OrderItemDTO toOrderItemDTO(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }

        OrderItemDTO orderItemDTO = new OrderItemDTO();

        orderItemDTO.setProductItemId( orderItemProductItemId( orderItem ) );
        orderItemDTO.setProductItemImage( orderItemProductItemProductImage( orderItem ) );
        orderItemDTO.setProductItemName( orderItemProductItemName( orderItem ) );
        orderItemDTO.setProductId( orderItemProductItemProductId( orderItem ) );
        orderItemDTO.setId( orderItem.getId() );
        orderItemDTO.setQuantity( orderItem.getQuantity() );
        orderItemDTO.setPrice( orderItem.getPrice() );
        orderItemDTO.setTotalPrice( orderItem.getTotalPrice() );

        return orderItemDTO;
    }

    @Override
    public List<OrderItemDTO> toOrderItemDTOs(List<OrderItem> orderItems) {
        if ( orderItems == null ) {
            return null;
        }

        List<OrderItemDTO> list = new ArrayList<OrderItemDTO>( orderItems.size() );
        for ( OrderItem orderItem : orderItems ) {
            list.add( toOrderItemDTO( orderItem ) );
        }

        return list;
    }

    @Override
    public OrderResponsev2 toOrderResponsev2(Orders orders) {
        if ( orders == null ) {
            return null;
        }

        OrderResponsev2 orderResponsev2 = new OrderResponsev2();

        orderResponsev2.setStatusOrder( ordersStatusOrderOrderStatus( orders ) );
        orderResponsev2.setId( orders.getId() );
        orderResponsev2.setTotalPayment( orders.getTotalPayment() );
        orderResponsev2.setTotalItem( orders.getTotalItem() );
        orderResponsev2.setCreatedAt( orders.getCreatedAt() );
        orderResponsev2.setUpdateAt( orders.getUpdateAt() );
        orderResponsev2.setUser( userToUserDTO( orders.getUser() ) );
        orderResponsev2.setAddress( addressToAddressDTO( orders.getAddress() ) );
        orderResponsev2.setUserPaymentMethod( toPaymentMethodDTO( orders.getUserPaymentMethod() ) );
        orderResponsev2.setDelivery( deliveryToDeliveryDTO( orders.getDelivery() ) );
        orderResponsev2.setFinalPayment( orders.getFinalPayment() );

        return orderResponsev2;
    }

    @Override
    public List<OrderResponsev2> toOrderResponsev2s(List<Orders> orders) {
        if ( orders == null ) {
            return null;
        }

        List<OrderResponsev2> list = new ArrayList<OrderResponsev2>( orders.size() );
        for ( Orders orders1 : orders ) {
            list.add( toOrderResponsev2( orders1 ) );
        }

        return list;
    }

    @Override
    public PaymentMethodDTO toPaymentMethodDTO(UserPaymentMethod userPaymentMethod) {
        if ( userPaymentMethod == null ) {
            return null;
        }

        PaymentMethodDTO paymentMethodDTO = new PaymentMethodDTO();

        paymentMethodDTO.setPaymentMethodId( userPaymentMethodPaymentMethodId( userPaymentMethod ) );
        paymentMethodDTO.setNameMethod( userPaymentMethodPaymentMethodNameMethod( userPaymentMethod ) );
        paymentMethodDTO.setId( userPaymentMethod.getId() );

        return paymentMethodDTO;
    }

    @Override
    public List<OrdersResponse> toOrderResponses(List<Orders> ordersList) {
        if ( ordersList == null ) {
            return null;
        }

        List<OrdersResponse> list = new ArrayList<OrdersResponse>( ordersList.size() );
        for ( Orders orders : ordersList ) {
            list.add( toOrderResponse( orders ) );
        }

        return list;
    }

    private String ordersStatusOrderOrderStatus(Orders orders) {
        if ( orders == null ) {
            return null;
        }
        StatusOrder statusOrder = orders.getStatusOrder();
        if ( statusOrder == null ) {
            return null;
        }
        String orderStatus = statusOrder.getOrderStatus();
        if ( orderStatus == null ) {
            return null;
        }
        return orderStatus;
    }

    protected UserDTO userToUserDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setId( user.getId() );
        userDTO.setEmail( user.getEmail() );
        userDTO.setFirstName( user.getFirstName() );
        userDTO.setLastName( user.getLastName() );
        userDTO.setPhone( user.getPhone() );

        return userDTO;
    }

    protected AddressDTO addressToAddressDTO(Address address) {
        if ( address == null ) {
            return null;
        }

        AddressDTO addressDTO = new AddressDTO();

        addressDTO.setId( address.getId() );
        addressDTO.setCity( address.getCity() );
        addressDTO.setStreetAddress( address.getStreetAddress() );
        addressDTO.setZipCode( address.getZipCode() );

        return addressDTO;
    }

    protected DeliveryDTO deliveryToDeliveryDTO(Delivery delivery) {
        if ( delivery == null ) {
            return null;
        }

        DeliveryDTO deliveryDTO = new DeliveryDTO();

        deliveryDTO.setId( delivery.getId() );
        deliveryDTO.setName( delivery.getName() );
        deliveryDTO.setPrice( delivery.getPrice() );
        deliveryDTO.setDescription( delivery.getDescription() );
        deliveryDTO.setEstimatedShippingTime( delivery.getEstimatedShippingTime() );

        return deliveryDTO;
    }

    private Long orderItemProductItemId(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }
        ProductItem productItem = orderItem.getProductItem();
        if ( productItem == null ) {
            return null;
        }
        Long id = productItem.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String orderItemProductItemProductImage(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }
        ProductItem productItem = orderItem.getProductItem();
        if ( productItem == null ) {
            return null;
        }
        String productImage = productItem.getProductImage();
        if ( productImage == null ) {
            return null;
        }
        return productImage;
    }

    private String orderItemProductItemName(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }
        ProductItem productItem = orderItem.getProductItem();
        if ( productItem == null ) {
            return null;
        }
        String name = productItem.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long orderItemProductItemProductId(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }
        ProductItem productItem = orderItem.getProductItem();
        if ( productItem == null ) {
            return null;
        }
        Product product = productItem.getProduct();
        if ( product == null ) {
            return null;
        }
        Long id = product.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Long userPaymentMethodPaymentMethodId(UserPaymentMethod userPaymentMethod) {
        if ( userPaymentMethod == null ) {
            return null;
        }
        PaymentMethod paymentMethod = userPaymentMethod.getPaymentMethod();
        if ( paymentMethod == null ) {
            return null;
        }
        Long id = paymentMethod.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String userPaymentMethodPaymentMethodNameMethod(UserPaymentMethod userPaymentMethod) {
        if ( userPaymentMethod == null ) {
            return null;
        }
        PaymentMethod paymentMethod = userPaymentMethod.getPaymentMethod();
        if ( paymentMethod == null ) {
            return null;
        }
        String nameMethod = paymentMethod.getNameMethod();
        if ( nameMethod == null ) {
            return null;
        }
        return nameMethod;
    }
}
