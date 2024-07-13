package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.PageResponse;

import java.security.Principal;

public interface RecommendService {

    PageResponse getRecommendProductFromUsersReview(Principal principal, Integer pageNumber);
}
