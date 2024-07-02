package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.voucher.ApplyVoucherRequest;
import com.ecomerce.roblnk.dto.voucher.EditVoucherRequest;
import com.ecomerce.roblnk.dto.voucher.VoucherRequest;
import com.ecomerce.roblnk.dto.voucher.VoucherResponse;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.mapper.VoucherMapper;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.Voucher;
import com.ecomerce.roblnk.repository.CartRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.repository.VoucherRepository;
import com.ecomerce.roblnk.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Date;
import java.util.List;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class IVoucherService implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @Override
    public List<VoucherResponse> getListVouchers() {
        var vouchers = voucherRepository.findAll();
        return voucherMapper.toVoucherResponseList(vouchers);
    }

    @Override
    public String createVoucher(VoucherRequest voucherRequest) {
        var voucher = new Voucher();
        voucher.setName(voucherRequest.getName());
        voucher.setVoucherCode(voucherRequest.getVoucherCode());
        voucher.setDiscountRate(voucherRequest.getDiscountRate());
        voucher.setMaximumDiscountValidPrice(voucherRequest.getMaximumDiscountValidPrice());
        voucher.setMinimumCartPrice(voucherRequest.getMinimumCartPrice());
        voucher.setQuantity(voucherRequest.getQuantity());
        voucher.setCurrentQuantity(0);
        voucher.setStartDate(voucherRequest.getStartDate());
        voucher.setEndDate(voucherRequest.getEndDate());
        voucher.setCreatedAt(new Date(System.currentTimeMillis()));
        voucher.setActive(true);
        voucherRepository.save(voucher);
        return "Successfully created voucher!";
    }

    @Override
    public String editVoucher(EditVoucherRequest editVoucherRequest) {
        var voucher = voucherRepository.findById(editVoucherRequest.getId());
        if (voucher.isPresent()){
            if ((editVoucherRequest.getName() != null) && !editVoucherRequest.getName().isEmpty()){
                voucher.get().setName(editVoucherRequest.getName());
            }
            if (editVoucherRequest.getDiscountRate() != null){
                voucher.get().setDiscountRate(editVoucherRequest.getDiscountRate());
            }
            if (editVoucherRequest.getMaximumDiscountValidPrice() != null){
                voucher.get().setMaximumDiscountValidPrice(editVoucherRequest.getMaximumDiscountValidPrice());
            }
            if (editVoucherRequest.getMinimumCartPrice() != null){
                voucher.get().setMinimumCartPrice(editVoucherRequest.getMinimumCartPrice());
            }
            if (editVoucherRequest.getDiscountRate() != null){
                voucher.get().setDiscountRate(editVoucherRequest.getDiscountRate());
            }
            if (editVoucherRequest.getVoucherCode() != null && !editVoucherRequest.getVoucherCode().isEmpty()){
                voucher.get().setVoucherCode(editVoucherRequest.getVoucherCode());
            }
            if (editVoucherRequest.getStartDate() != null){
                voucher.get().setStartDate(editVoucherRequest.getStartDate());
            }
            if (editVoucherRequest.getEndDate() != null){
                voucher.get().setEndDate(editVoucherRequest.getEndDate());
            }
            voucher.get().setActive(editVoucherRequest.isActive());

            voucherRepository.save(voucher.get());
            return "Successfully edited voucher!";

        }
        else return "Not found any voucher!";
    }

    @Override
    public String deleteVoucher(Long id) {
        var voucher = voucherRepository.findById(id);
        if (voucher.isPresent()) {
            if (voucher.get().isActive()) {
                voucher.get().setActive(false);
                voucherRepository.save(voucher.get());
                return "Successfully deactive sale";
            } else {
                voucher.get().setActive(true);
                voucherRepository.save(voucher.get());
                return "Successfully active voucher";
            }
        } else
            return "Voucher not found or not available to delete!";
    }

    @Override
    public ResponseEntity<?> applyVoucher(ApplyVoucherRequest voucherRequest, Principal principal) {
        var user = userRepository.findByEmail(principal.getName());
        if (user.isPresent()) {
            var cart = user.get().getCart();
            var voucher = voucherRepository.findById(voucherRequest.getVoucherId());
            if (voucher.isPresent()){
                if (cart.getVoucher() == null
                        && voucher.get().getMinimumCartPrice() < cart.getTotalPrice()
                        && voucher.get().getEndDate().after(new Date(System.currentTimeMillis()))
                        && voucher.get().getStartDate().before(new Date(System.currentTimeMillis()))
                        && voucher.get().getCurrentQuantity() < voucher.get().getQuantity()){
                    cart.setVoucher(voucher.get());
                    voucher.get().setCurrentQuantity(voucher.get().getCurrentQuantity() + 1);

                    cartRepository.save(cart);
                    voucherRepository.save(voucher.get());
                    return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                            .statusCode(200)
                            .message(String.valueOf(HttpStatus.OK))
                            .description("Successfully apply voucher!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build());
                }
                else return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                        .statusCode(403)
                        .message(String.valueOf(HttpStatus.FORBIDDEN))
                        .description("Cart is not qualify to apply voucher or have been applied another voucher!")
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
            }
            else return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.builder()
                    .statusCode(403)
                    .message(String.valueOf(HttpStatus.FORBIDDEN))
                    .description("Voucher is not found!")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                .statusCode(404)
                .message(String.valueOf(HttpStatus.NOT_FOUND))
                .description(EMAIL_NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build());

    }

    @Override
    public ResponseEntity<?> revokeVoucher(Long cartId, Principal principal) {
        var user = userRepository.findByEmail(principal.getName());
        System.out.println(principal.getName());
        if (user.isPresent()) {
            var cart = user.get().getCart();
            if (cart.getVoucher() != null){
                int finalPrice = 0;
                for (CartItem cartItem: cart.getCartItems()){
                    finalPrice += cartItem.getTotalPrice();
                }
                finalPrice = (int) (Math.round(finalPrice/1000.0) * 1000 + 1000);
                cart.setTotalPrice(finalPrice);
                cart.setVoucher(null);
                cartRepository.save(cart);
                return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                        .statusCode(200)
                        .message(String.valueOf(HttpStatus.OK))
                        .description("Successfully revoked voucher!")
                        .timestamp(new Date(System.currentTimeMillis()))
                        .build());
            }
            else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description("Not found any applied voucher to revoke!")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        }
        else return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                .statusCode(404)
                .message(String.valueOf(HttpStatus.NOT_FOUND))
                .description(EMAIL_NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build());
    }

    @Override
    public List<VoucherResponse> getListVouchersForAll() {
        var vouchers = voucherRepository.findAll();
        int i = 0;
        while (i < vouchers.size()){
            if (vouchers.get(i).getCurrentQuantity() >= vouchers.get(i).getQuantity() || !vouchers.get(i).isActive()){
                vouchers.remove(i);
            }
            else i++;
        }
        return voucherMapper.toVoucherResponseList(vouchers);    }

}
