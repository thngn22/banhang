package com.ecomerce.roblnk.dto.url;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class Geometry {
    private LocationTarget location;
    private String boundary;
}
