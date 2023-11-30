package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.user.*;
import com.ecomerce.roblnk.mapper.UserMapper;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.model.UserAddress;
import com.ecomerce.roblnk.repository.AddressRepository;
import com.ecomerce.roblnk.repository.PaymentMethodRepository;
import com.ecomerce.roblnk.repository.UserAddressRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.security.JwtService;
import com.ecomerce.roblnk.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service("IUserService")
@AllArgsConstructor
public class IUserService implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PaymentMethodRepository paymentMethodRepository;
    private final UserAddressRepository userAddressRepository;
    private final AddressRepository addressRepository;

    @Override
    public UserDetailResponse getDetailUser(Long userId) {
        var user = userRepository.findById(userId).orElseThrow(() ->
                new UsernameNotFoundException("User not found with ID: " + userId));
        return userMapper.toUserDetailResponse(user);
    }

    @Override
    public User findUserProfileByJwt(String jwt) {
        String email = jwtService.getEmailFromToken(jwt);
        return userRepository.findByEmail(email).orElseThrow(()
                -> new UsernameNotFoundException("User not found!"));
    }


    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        var userList = userRepository.findAll();
        return userMapper.toListUserResponse(userList);
    }

    @Override
    public ResponseEntity<?> editInformation(Principal connectedUser, EditUserProfileRequest request) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var userName = userRepository.findByUserName(request.getUserName());
        if (userName.isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User name existed, please try another user name!");
        }
        if (user != null){
            user.setUserName(request.getUserName());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setDob(request.getDob());
            user.setAvatar(request.getAvatar());
            userRepository.save(user);
            return ResponseEntity.ok("successfully saved!");
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any user! Something went wrong...");
    }

    @Override
    public ResponseEntity<?> getUserPayment(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null){
            var userPayments = paymentMethodRepository.findAllByUser_Email(user.getEmail());
            return ResponseEntity.ok(userMapper.toUserPaymentResponses(userPayments));
        }
        else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any user!");
    }

    @Override
    public ResponseEntity<?> addUserPayment(Principal connectedUser, UserPaymentRequest request) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (user != null){
            var userPayment = paymentMethodRepository.findAllByCardNumber(request.getCardNumber());
            if (userPayment.isPresent()){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Already existed card number, please try another card with another card number!");
            }
            var userPaymentEntity = userMapper.toPaymentEntity(request);
            userPaymentEntity.setUser(user);
            paymentMethodRepository.save(userPaymentEntity);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found any user!");
    }

    @Override
    public ResponseEntity<?> getUserAddress(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var userAddress = userAddressRepository.findAllByUser_Email(user.getEmail());
        var addressList = userMapper.toListUserAddressResponse(userAddress);
        return ResponseEntity.ok(addressList);
    }

    @Override
    public ResponseEntity<?> addUserAddress(Principal connectedUser, UserAddressRequest userAddressRequest) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var address = userMapper.toAddressEntity(userAddressRequest);
        var user_address = userAddressRepository.findAllByUser_Email(user.getEmail());
        UserAddress userAddress = new UserAddress();
        userAddress.setUser(user);
        userAddress.setAddress(address);
        userAddress.setDefault(false);
        user_address.add(userAddress);
        addressRepository.save(address);
        userAddressRepository.save(userAddress);
        return ResponseEntity.ok("Added new address!");
    }

    @Override
    public ResponseEntity<?> updateUserAddress(Principal connectedUser, Long id, UserAddressRequest userUpdateAddressRequest) {
        var addressId = addressRepository.findById(id);
        if (addressId.isPresent()){
            addressId.get().setCity(userUpdateAddressRequest.getCity());
            addressId.get().setStreetAddress(userUpdateAddressRequest.getStreetAddress());
            addressId.get().setZipCode(userUpdateAddressRequest.getZipCode());
            addressRepository.save(addressId.get());
            return ResponseEntity.ok("Updated address!");
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found address to update!");
        }
    }

    @Override
    public ResponseEntity<?> deleteUserAddress(Principal connectedUser, Long id) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var userAddresses = userAddressRepository.findUserAddressByAddress_IdAndUser_Email(id, user.getEmail());
        if (userAddresses.isPresent()){
            System.out.println(userAddresses.get().getId());
            userAddressRepository.delete(userAddresses.get());
            return ResponseEntity.ok("Deleted address!");
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found address to delete!");
        }
    }

    @Override
    public ResponseEntity<?> deActiveOrActiveUser(Principal connectedUser, Long id) {
        var admin = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (admin == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid account, please login again!");
        }
        var user = userRepository.findById(id);
        if (user.isPresent()){
            if (user.get().isActive()){
                user.get().setActive(false);
                userRepository.save(user.get());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("Deactive user successfully!");
            }
            else {
                user.get().setActive(true);
                userRepository.save(user.get());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body("Active user successfully!");
            }
        }
        else
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Something went wrong, user is not existed!");

    }

    @Override
    public ResponseEntity<?> findInformationUser(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        var userInformation = userMapper.toUserProfileResponse(user);
        return ResponseEntity.ok(userInformation);
    }
}
