package com.ecomerce.roblnk.configuration;

import com.ecomerce.roblnk.repository.ChatUserRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.security.JwtService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Map;
@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketInterceptor implements ChannelInterceptor {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final AuthenticationProvider authenticationProvider;


    @Override

    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            Authentication authenticatedUser = null;
            Object raw = message.getHeaders().get(SimpMessageHeaderAccessor.NATIVE_HEADERS);
            log.info("instance of raw: {}", raw);;
            String name = ((Map) raw).get("Authorization").toString();
            var jwt = (String) name.substring(7);
            var userEmail = jwtService.extractEmail(jwt);
            try {
                var chatUser = userRepository.findByEmail(userEmail).orElseThrow().getChatUser();
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        chatUser,
                        null,
                        chatUser.getAuthorities());
                log.info("chatUserId: {}", chatUser.getId());
                accessor.setUser(authToken);

                System.out.println("Set thanh cong");
            }
            catch (Exception e) {
                System.out.println(e.toString());
            }
        }
        return message;
    }
}
