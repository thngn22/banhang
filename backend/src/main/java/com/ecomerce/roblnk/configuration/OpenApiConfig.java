package com.ecomerce.roblnk.configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Vu Nguyen Trung Khang",
                        email = "vunguyentrungkhang@gmail.com",
                        url = "https://facebook.com/RoblnK"
                ),
                description = "OpenApi documentation for e-Commerce Shoes Project",
                title = "OpenApi specification - Vu Nguyen Trung Khang, Nguyen Huu Thang",
                version = "1.0",
                license = @License(
                        name = "Licence name",
                        url = "https://facebook.com"
                ),
                termsOfService = "Terms of service"
        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:7586"
                )

        },
        security = {
                @SecurityRequirement(
                        name = "Security"
                )
        }
)
@SecurityScheme(
        name = "Security",
        description = "JWT auth description",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
