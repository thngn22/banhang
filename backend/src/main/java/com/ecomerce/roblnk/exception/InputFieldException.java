package com.ecomerce.roblnk.exception;

import lombok.Data;
import lombok.Getter;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.Arrays;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
public class InputFieldException extends RuntimeException {

    private final BindingResult bindingResult;
    private final String message;

    public InputFieldException(BindingResult bindingResult) {
        this.bindingResult = bindingResult;
        var string = Arrays.stream(Objects.requireNonNull(bindingResult.getAllErrors().get(0).getArguments())).toList().get(0);
        this.message = string.toString().substring(string.toString().lastIndexOf("[") + 1, string.toString().lastIndexOf("]"))
                + " " + bindingResult.getAllErrors().get(0).getDefaultMessage();
    }
}
