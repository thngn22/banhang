package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.PageResponse;
import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.recommender.CollaborativeFilteringRecommender;
import com.ecomerce.roblnk.service.RecommendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import static com.ecomerce.roblnk.util.PageUtil.CAROUSEL_SIZE;
import static com.ecomerce.roblnk.util.PageUtil.PAGE_SIZE_ADMIN;

@Service
@RequiredArgsConstructor
@Slf4j
public class IRecommendService implements RecommendService {
    private final CollaborativeFilteringRecommender filteringRecommender;

    @Override
    public PageResponse getRecommendProductFromUsersReview(Principal principal, Integer pageNumber) {

        Pageable pageable = PageRequest.of(Math.max(pageNumber - 1, 0), PAGE_SIZE_ADMIN);

        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (user != null) {
            var productResponseList = filteringRecommender.recommendedProducts(user.getId());

            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), productResponseList.size());
            List<ProductResponse> pageContent = new ArrayList<>();
            if (start < end) {
                pageContent = productResponseList.subList(start, end);

            }
            Page<ProductResponse> page = new PageImpl<>(pageContent, pageable, productResponseList.size());
            PageResponse productResponse = new PageResponse();
            productResponse.setContents(pageContent);
            productResponse.setPageSize(page.getSize());
            productResponse.setPageNumber(page.getNumber() + 1);
            productResponse.setTotalPage(page.getTotalPages());
            productResponse.setTotalElements(page.getTotalElements());
            return productResponse;
        }
        else return null;

    }


}
