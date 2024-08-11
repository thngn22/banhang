package com.ecomerce.roblnk.recommender;
import com.ecomerce.roblnk.dto.product.ProductResponse;
import com.ecomerce.roblnk.mapper.ProductMapper;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

import static com.ecomerce.roblnk.util.PageUtil.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class CollaborativeFilteringRecommender {


    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final ProductItemRepository productItemRepository;
    private final ProductMapper productMapper;
    private final SaleProductRepository saleProductRepository;
    private Map<Long, Map<Long, Integer>> ratings = new HashMap<>();
    private final Map<Long, Double> averageRating = new HashMap<>();

    public List<ProductResponse> recommendedProducts(Long userId) {
        log.info("CollaborativeFilteringRecommender: recommendedBooks() called - user id: " + userId);
        Map<Long, Map<Long, Integer>> myRatesMap = new TreeMap<>();
        Map<Long, Map<Long, Integer>> userWithRatesMap = new TreeMap<>();

        List<Integer> list = new ArrayList<>();
        userRepository.findAll().forEach(userItem -> {
            Long userID = userItem.getId();
            Map<Long, Integer> userRatings = new HashMap<>();

            reviewRepository.findAllByUserId(userID).forEach(userProductRating -> {
                        userRatings.put(userProductRating.getProduct().getId(), userProductRating.getRating());

                    }
            );
            System.out.println("userRatings: " + userRatings.size());
            if (userId.compareTo(userID) == 0) {
                myRatesMap.put(userID, userRatings);
            } else {
                userWithRatesMap.put(userID, userRatings);
                ratings = userWithRatesMap;
                averageRating.put(userID, 0.0);
                for (Map.Entry<Long, Integer> longIntegerEntry : userRatings.entrySet()) {
                    if (ratings.containsKey(userID)) {
                        ratings.get(userID).put(longIntegerEntry.getKey(), longIntegerEntry.getValue());
                        averageRating.put(userID, averageRating.get(userID) + (double) longIntegerEntry.getValue());
                    } else {
                        Map<Long, Integer> bookRating = new HashMap<>();
                        bookRating.put(longIntegerEntry.getKey(), longIntegerEntry.getValue());
                        ratings.put(userID, bookRating);
                        averageRating.put(userID, (double) longIntegerEntry.getValue());
                    }
                }
            }
        });

        for (Map.Entry<Long, Double> longDoubleEntry : averageRating.entrySet()) {
            if (ratings.containsKey(longDoubleEntry.getKey())) {
                longDoubleEntry.setValue(longDoubleEntry.getValue() / (double) ratings.get(longDoubleEntry.getKey()).size());
            }
        }
        log.info("averageRating: {} ", averageRating);
        log.info("myRatesMap: {} ", myRatesMap);

        Map<Long, String> products = new HashMap<>();
        productRepository.findAll().forEach(product -> products.put(product.getId(), product.getName()));


        Map<Long, Double> neighbourhoods = getNeighbourhoods(myRatesMap.get(userId), averageRating, ratings);
        Map<Long, Double> recommendations = getRecommendations(myRatesMap.get(userId), neighbourhoods, products, averageRating, ratings);
        log.info("neighbourhoods : {}", neighbourhoods);
        log.info("recommendations : {}", recommendations);
        Map<Long, Double> sortedRecommendations = new TreeMap<>(recommendations);
        sortedRecommendations.putAll(recommendations);

        Iterator<Map.Entry<Long, Double>> sortedREntries = sortedRecommendations.entrySet().iterator();
        log.info("sortedREntries : {}", sortedREntries);

        List<Product> recommendedProducts = new ArrayList<>();

        int i = 0;
        while (sortedREntries.hasNext() && i < NUM_RECOMMENDATIONS) {
            Map.Entry<Long, Double> entry = sortedREntries.next();
            if (entry.getValue() >= MIN_VALUE_RECOMMENDATION) {
                Optional<Product> optionalProduct = productRepository.findById(Long.valueOf(entry.getKey().toString()));
                optionalProduct.ifPresent(recommendedProducts::add);
                log.info("recommendedProductName: {} ", optionalProduct.get().getName());

                i++;
            }
        }
        log.info("CollaborativeFilteringRecommender: recommendedProducts() ended - size: " + recommendedProducts.size());



        List<Integer> list_products = new ArrayList<>();
        List<Integer> salePrices = new ArrayList<>();
        List<Double> discountRate = new ArrayList<>();
        List<Long> saleIds = new ArrayList<>();
        //Convert to Response
        i = 0;
        while (i < recommendedProducts.size()) {
            if (!recommendedProducts.get(i).isActive()) {
                recommendedProducts.remove(i);
                continue;
            }
            int total = 0;
            var items = productItemRepository.findAllByProduct_Id(recommendedProducts.get(i).getId());
            var estimatedPrice = 0.0;
            for (ProductItem productItem : items) {
                total += productItem.getQuantityInStock();
                estimatedPrice = productItem.getPrice();
            }
            list_products.add(total);
            var saleProduct = saleProductRepository.findSaleProductByProduct_IdAndSaleNotNullAndSale_Active(recommendedProducts.get(i).getId(), true);
            if (saleProduct.isPresent()) {
                if (saleProduct.get().getSale().getEndDate().after(new Date(System.currentTimeMillis()))
                        && saleProduct.get().getSale().getStartDate().before(new Date(System.currentTimeMillis()))) {
                    discountRate.add(saleProduct.get().getSale().getDiscountRate());
                    double finalPrice = (estimatedPrice - estimatedPrice * 0.01 * saleProduct.get().getSale().getDiscountRate());
                    salePrices.add((int) (Math.round(finalPrice / 1000.0) * 1000 + 1000));
                    saleIds.add(saleProduct.get().getSale().getId());
                } else {
                    discountRate.add(0.0);
                    salePrices.add((int) estimatedPrice);
                    saleIds.add(null);
                }
            }
            else {
                discountRate.add(0.0);
                salePrices.add((int) estimatedPrice);
                saleIds.add(null);
            }
            i++;
        }
        var productResponseList = productMapper.toProductResponseList(recommendedProducts);
        for (int j = 0; j < productResponseList.size(); j++) {
            productResponseList.get(j).setQuantity(list_products.get(j));
            productResponseList.get(j).setSalePrice(salePrices.get(j));
            productResponseList.get(j).setDiscountRate(discountRate.get(j));
            productResponseList.get(j).setSaleId(saleIds.get(j));
        }
        return productResponseList;
    }


    /**
     * Get the k-nearest neighbourhoods using Pearson:
     * sim(i,j) = numerator / (sqrt(userDenominator^2) * sqrt(otherUserDenominator^2))
     * numerator = sum((r(u,i) - r(u)) * (r(v,i) - r(v)))
     * userDenominator = sum(r(u,i) - r(i))
     * otherUserDenominator = sum(r(v,i) - r(v))
     * r(u,i): rating of the book i by the user u
     * r(u): average rating of the user u
     * @return nearest neighbourhoods
     */
    private Map<Long, Double> getNeighbourhoods(Map<Long, Integer> userRatings, Map<Long, Double> averageRating, Map<Long, Map<Long, Integer>> ratings) {
        Map<Long, Double> neighbourhoods = new HashMap<>();
        Map<Long, Double> sortedNeighbourhoods = new TreeMap<>(neighbourhoods);
        log.info("Rating: {}", ratings);
        log.info("userRatings: {}", userRatings);
        double userAverage = getAverage(userRatings);
        for (long user : ratings.keySet()) {
            ArrayList<Long> matches = new ArrayList<>();
            for (long bookId : userRatings.keySet()) {
                if (ratings.get(user).containsKey(bookId)) {
                    matches.add(bookId);
                }
            }
            double matchRate;
            if (!matches.isEmpty()) {
                double numerator = 0, userDenominator = 0, otherUserDenominator = 0;
                for (long bookId : matches) {
                    double u = Math.abs(userRatings.get(bookId) - userAverage);
                    double v = Math.abs(ratings.get(user).get(bookId) - averageRating.get(user));

                    numerator += u * v;
                    userDenominator += u * u;
                    otherUserDenominator += v * v;
                }
                if (userDenominator == 0 || otherUserDenominator == 0) {
                    matchRate = 0;
                } else {
                    matchRate = numerator / (Math.sqrt(userDenominator) * Math.sqrt(otherUserDenominator));
                }
            } else {
                matchRate = 0;
            }

            neighbourhoods.put(user, matchRate);
        }
        sortedNeighbourhoods.putAll(neighbourhoods);
        Map<Long, Double> output = new TreeMap<>();

        Iterator<Map.Entry<Long, Double>> entries = sortedNeighbourhoods.entrySet().iterator();
        int i = 0;
        while (entries.hasNext() && i < NUM_NEIGHBOURHOODS) {
            Map.Entry<Long, Double> entry = entries.next();
            if (entry.getValue() > 0) {
                output.put(entry.getKey(), entry.getValue());
                i++;
            }
        }
        return output;
    }

    /**
     * Get predictions of each book by a user giving some ratings and its neighbourhood:
     * r(u,i) = r(u) + sum(sim(u,v) * (r(v,i) - r(v))) / sum(abs(sim(u,v)))
     * sim(u,v): similarity between u and v users
     * r(u,i): rating of the book i by the user u
     * r(u): average rating of the user u
     * @return predictions for each book
     */
    private Map<Long, Double> getRecommendations(Map<Long, Integer> userRatings, Map<Long, Double> neighbourhoods, Map<Long, String> products, Map<Long, Double> averageRating, Map<Long, Map<Long, Integer>> ratings) {
        Map<Long, Double> predictedRatings = new HashMap<>();

        // r(u)
        double userAverage = getAverage(userRatings);

        for (Long productId : products.keySet()) {
            //if (!userRatings.containsKey(productId)) {

            // sum(sim(u,v) * (r(v,i) - r(v)))
            double numerator = 0;

            // sum(abs(sim(u,v)))
            double denominator = 0;

            for (Long neighbourhood : neighbourhoods.keySet()) {
                if (ratings.get(neighbourhood).containsKey(productId)) {
                    double matchRate = neighbourhoods.get(neighbourhood);
                    numerator += matchRate * (ratings.get(neighbourhood).get(productId) - averageRating.get(neighbourhood));
                    denominator += Math.abs(matchRate);
                }
            }

            double predictedRating = 0;
            if (denominator > 0) {
                predictedRating = userAverage + numerator / denominator;
                if (predictedRating > 5) {
                    predictedRating = 5;
                }
            }
            predictedRatings.put(productId, predictedRating);
            // }
        }
        return predictedRatings;
    }

    /**
     * Get average of the ratings of a user
     *
     * @param userRatings ratings of a user
     * @return average or the ratings of a user
     */
    private double getAverage(Map<Long, Integer> userRatings) {
        double userAverage = 0;
        for (Map.Entry<Long, Integer> longIntegerEntry : userRatings.entrySet()) {
            userAverage += (int) ((Map.Entry<?, ?>) longIntegerEntry).getValue();
        }
        return userAverage / userRatings.size();
    }
}

