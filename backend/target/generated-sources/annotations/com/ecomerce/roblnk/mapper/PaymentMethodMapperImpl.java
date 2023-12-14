package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.cart.PaymentMethodResponse;
import com.ecomerce.roblnk.model.PaymentMethod;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:56+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class PaymentMethodMapperImpl implements PaymentMethodMapper {

    @Override
    public PaymentMethodResponse toPaymentMethodResponse(PaymentMethod paymentMethod) {
        if ( paymentMethod == null ) {
            return null;
        }

        PaymentMethodResponse paymentMethodResponse = new PaymentMethodResponse();

        paymentMethodResponse.setId( paymentMethod.getId() );
        paymentMethodResponse.setNameMethod( paymentMethod.getNameMethod() );
        paymentMethodResponse.setDescribes( paymentMethod.getDescribes() );

        return paymentMethodResponse;
    }

    @Override
    public List<PaymentMethodResponse> toPaymentMethodResponses(List<PaymentMethod> paymentMethods) {
        if ( paymentMethods == null ) {
            return null;
        }

        List<PaymentMethodResponse> list = new ArrayList<PaymentMethodResponse>( paymentMethods.size() );
        for ( PaymentMethod paymentMethod : paymentMethods ) {
            list.add( toPaymentMethodResponse( paymentMethod ) );
        }

        return list;
    }
}
