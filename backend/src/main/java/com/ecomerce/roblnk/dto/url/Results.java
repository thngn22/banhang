package com.ecomerce.roblnk.dto.url;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class Results {
    private List<AddressComponents> address_components;
    private String formatted_address;
    private Geometry geometry;
    private String place_id;
    private String reference;
    private PlusCode plus_code;
    private Compound compound;
    private List<String> types;
    private String name;
    private String address;
}
