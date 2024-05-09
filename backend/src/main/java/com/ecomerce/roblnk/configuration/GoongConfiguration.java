package com.ecomerce.roblnk.configuration;

import com.ecomerce.roblnk.dto.cart.UserAddressRequestv2;
import com.ecomerce.roblnk.dto.url.AddressFromURL;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;

import static com.ecomerce.roblnk.util.PageUtil.EARTH_RADIUS;

@Configuration
public class GoongConfiguration {

    @Value("${goong.api-key}")
    private String api_key;

    @Value("${goong.base-url}")
    private String base_url;

    @Value("${goong.main-url}")
    private String main_url;

    @Value("${goong.lat}")
    private Double main_lat;

    @Value("${goong.lng}")
    private Double main_lng;

    public String urlTarget(UserAddressRequestv2 address) {
       var string_address = address.getAddress() + ",%20"
               + address.getWard() + ",%20"
               + address.getDistrict() + ",%20"
               + address.getCity();
       string_address = string_address.replace(" ", "%20");
       return base_url + "/geocode?address=" + string_address + "&api_key=" + api_key;
    }

    public Double calculateDistance(UserAddressRequestv2 address) throws java.io.IOException, IOException, URISyntaxException {
        var url_target = urlTarget(address);

        URI jsonUrl = new URI(url_target);
        ObjectMapper mapper = new ObjectMapper();

        AddressFromURL addressClass = mapper.readValue(jsonUrl.toURL(), AddressFromURL.class);
        System.out.println(addressClass);

        var lat = addressClass.getResults().get(addressClass.getResults().size()-1).getGeometry().getLocation().getLat();
        var lng = addressClass.getResults().get(addressClass.getResults().size()-1).getGeometry().getLocation().getLng();

        System.out.println(lat);
        System.out.println(lng);
        System.out.println(main_lat);
        System.out.println(main_lng);

        return distance(lat, lng, main_lat, main_lng);
    }

    private Double distance(Double lat1, Double lng1, Double lat2, Double lng2) {
        var p = Math.PI / 180;
        var d = 0.5 - Math.cos((lat2 - lat1) * p) / 2
                + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
                (1 - Math.cos((lng2 - lng1) * p)) / 2;
        return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(d));
    }

}
