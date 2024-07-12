package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.PageResponse;
import com.ecomerce.roblnk.dto.voucher.*;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.mapper.VoucherMapper;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.Voucher;
import com.ecomerce.roblnk.repository.CartRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.repository.VoucherRepository;
import com.ecomerce.roblnk.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;
import static com.ecomerce.roblnk.util.PageUtil.PAGE_SIZE_ADMIN;

@Service
@RequiredArgsConstructor
public class IVoucherService implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @Override
    public PageResponse getListVouchers(FilterVoucherRequest filterVoucherRequest) {
        var voucher_id = filterVoucherRequest.getVoucher_id();
        var voucher_code = filterVoucherRequest.getVoucher_code();
        var name = filterVoucherRequest.getName().trim();
        var discounted_rate = filterVoucherRequest.getDiscount_rate();
        var state = filterVoucherRequest.getState();
        var pageNumber = filterVoucherRequest.getPageNumber() != null ? filterVoucherRequest.getPageNumber() : 1;
        Specification<Voucher> specification = specificationVoucher(voucher_id, name, voucher_code, discounted_rate, state, filterVoucherRequest.getStart_date(), filterVoucherRequest.getEnd_date());


        var vouchers = voucherRepository.findAll(specification);
        var voucherResponse = voucherMapper.toVoucherResponseList(vouchers);
        Pageable pageable = PageRequest.of(Math.max(pageNumber - 1, 0), PAGE_SIZE_ADMIN);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), voucherResponse.size());
        List<VoucherResponse> pageContent = new ArrayList<>();
        if (start < end) {
            pageContent = voucherResponse.subList(start, end);

        }
        Page<VoucherResponse> page = new PageImpl<>(pageContent, pageable, voucherResponse.size());
        PageResponse productResponse = new PageResponse();
        productResponse.setContents(pageContent);
        productResponse.setPageSize(page.getSize());
        productResponse.setPageNumber(page.getNumber() + 1);
        productResponse.setTotalPage(page.getTotalPages());
        productResponse.setTotalElements(page.getTotalElements());
        return productResponse;

    }

    private Specification<Voucher> specificationVoucher(Long voucherId, String name, String voucherCode, Double discountedRate, String state, Date startDate, Date endDate) {
        Specification<Voucher> voucherSpec = hasIdVoucher(voucherId);
        Specification<Voucher> voucherCodeSpec = hasCodeVoucher(voucherCode);
        Specification<Voucher> nameSpec = hasNameVoucher(name);
        Specification<Voucher> discountedRateSpec = hasDiscountedRateVoucher(discountedRate);
        Specification<Voucher> stateSaleSpec = hasStateVoucher(state);
        Specification<Voucher> startDateSaleSpec = hasStartDateVoucher(startDate);
        Specification<Voucher> endDateSaleSpec = hasEndDateVoucher(endDate);
        Specification<Voucher> specification = Specification.where(null);

        if (voucherId != null) {
            specification = specification.and(voucherSpec);
        }
        if (voucherCode != null && !voucherCode.isEmpty()) {
            specification = specification.and(voucherCodeSpec);
        }
        if (name != null && !name.isEmpty()) {
            specification = specification.and(nameSpec);
        }
        if (discountedRate != null) {
            specification = specification.and(discountedRateSpec);
        }
        if (state != null && !state.isEmpty()) {
            specification = specification.and(stateSaleSpec);
        }
        if (startDate != null) {
            specification = specification.and(startDateSaleSpec);
        }
        if (endDate != null) {
            specification = specification.and(endDateSaleSpec);
        }
        return specification;
    }

    private Specification<Voucher> hasIdVoucher(Long voucherId) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("id"), voucherId);
    }

    private Specification<Voucher> hasCodeVoucher(String voucherCode) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("voucherCode"), "%" + voucherCode + "%");
    }

    private Specification<Voucher> hasNameVoucher(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("name"), "%" + name + "%");
    }

    private Specification<Voucher> hasDiscountedRateVoucher(Double discountedRate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("discountRate"), discountedRate);
    }

    private Specification<Voucher> hasStateVoucher(String state) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("active"), state);
    }

    private Specification<Voucher> hasStartDateVoucher(Date startDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), startDate);
    }

    private Specification<Voucher> hasEndDateVoucher(Date endDate) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("endDate"), endDate);
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
        voucher.setUsedQuantity(0);
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
                        && voucher.get().getUsedQuantity() < voucher.get().getQuantity()){
                    cart.setVoucher(voucher.get());
                    voucher.get().setUsedQuantity(voucher.get().getUsedQuantity() + 1);

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
                var voucher = cart.getVoucher();
                if (voucher != null){
                    voucher.setUsedQuantity(voucher.getUsedQuantity() - 1);
                    voucherRepository.save(voucher);
                    cart.setVoucher(null);
                }

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
            if (vouchers.get(i).getUsedQuantity() >= vouchers.get(i).getQuantity() || !vouchers.get(i).isActive()){
                vouchers.remove(i);
            }
            else i++;
        }
        return voucherMapper.toVoucherResponseList(vouchers);    }

    @Override
    public VoucherResponse getVoucherDetail(Long id) {
        var vouchers = voucherRepository.findById(id);
        return vouchers.map(voucherMapper::toVoucherResponse).orElse(null);
    }

}
