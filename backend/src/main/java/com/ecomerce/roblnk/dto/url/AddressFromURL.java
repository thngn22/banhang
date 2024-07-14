package com.ecomerce.roblnk.dto.url;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class AddressFromURL {
    private List<Results> results;
    private String status;
}
