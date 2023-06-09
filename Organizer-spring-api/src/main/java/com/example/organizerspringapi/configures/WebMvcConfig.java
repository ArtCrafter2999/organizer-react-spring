package com.example.organizerspringapi.configures;

import com.example.organizerspringapi.authorization.AuthorizationInterceptor;
import com.example.organizerspringapi.repositories.UserRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final UserRepository userRepository;

    public WebMvcConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AuthorizationInterceptor(userRepository));
    }
}