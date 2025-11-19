package com.example.habittracker.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.habittracker.model.User;
import com.example.habittracker.repository.UserRepository;

import org.springframework.security.core.userdetails.User.UserBuilder;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User usuario = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(usuario.getEmail());
        builder.password(usuario.getPassword());
        builder.authorities("ROLE_USER");
        builder.accountLocked(false);
        builder.disabled(false);

        return builder.build();
    }
}
