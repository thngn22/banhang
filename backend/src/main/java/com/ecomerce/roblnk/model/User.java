package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dob;
    private String gender;
    private boolean isEmailActive;
    private boolean isPhoneActive;
    private boolean isActive;
    private String avatar;

    @Column(name = "one_time_password")
    private String oneTimePassword;

    @Column(name = "otp_requested_time")
    private Date otpRequestedTime;

    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;

    //Token
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Token> tokens;

    //Role
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    //Address
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonIgnore
    private List<UserAddress> addresses;

    //Cart
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Cart> cart;

    //Payment Method
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<PaymentMethod> paymentMethods;


    //Review
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Review> review;

    //Order
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Orders> orders;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getRole()));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}