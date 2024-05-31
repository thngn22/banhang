//package com.ecomerce.roblnk.configuration;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.simp.SimpMessageType;
//import org.springframework.security.authorization.AuthorizationManager;
//import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
//import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.WebSocketMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;
//
//import static org.springframework.messaging.simp.SimpMessageType.MESSAGE;
//import static org.springframework.messaging.simp.SimpMessageType.SUBSCRIBE;
//
//@Configuration
//@EnableWebSocketSecurity
//@Slf4j
//@RequiredArgsConstructor
//public class WebSocketSecurityConfiguration implements WebSocketConfigurer {
//    @Bean
//    AuthorizationManager<Message<?>> messageAuthorizationManager(MessageMatcherDelegatingAuthorizationManager.Builder messages) {
//        messages
//                .simpTypeMatchers(SimpMessageType.CONNECT,
//                        SimpMessageType.HEARTBEAT,
//                        SimpMessageType.UNSUBSCRIBE,
//                        SimpMessageType.DISCONNECT)
//                .permitAll()
//                .anyMessage().authenticated() //or permitAll
//                .simpDestMatchers("/**").authenticated();//or permitAll
//        return messages.build();
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(new WebSocketHandler(), "/socket").setAllowedOrigins("http://localhost:3000");
//    }
//    @Bean
//    public ServletServerContainerFactoryBean createWebSocketContainer() {
//        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
//        container.setMaxBinaryMessageBufferSize(1024000);
//        return container;
//    }
////    @Bean
////    public WebSocketHandler getHandler() {
////        return new WebSocketHandler() {
////            @Override
////            public void afterConnectionEstablished(WebSocketSession session) throws Exception {
////
////                log.info("da vao dc afterConnectionEstablished");
////
////            }
////
////            @Override
////            public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
////                log.info("da vao dc handleMessage: {}", message.getPayload());
////                session.sendMessage(message);
////            }
////
////            @Override
////            public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
////                log.info("da vao dc handleTransportError");
////            }
////
////            @Override
////            public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
////                log.info("da vao dc afterConnectionClosed");
////
////            }
////
////            @Override
////            public boolean supportsPartialMessages() {
////                log.info("da vao dc supportsPartialMessages");
////
////                return false;
////            }
////        };
////    }
//}
