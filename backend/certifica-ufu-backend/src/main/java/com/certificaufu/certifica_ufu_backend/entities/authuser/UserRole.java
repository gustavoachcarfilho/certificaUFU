package com.certificaufu.certifica_ufu_backend.entities.authuser;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
public enum UserRole {
    ADMIN("admin"),
    USER("user");

    private String role;

    UserRole(String role) {
        this.role = role;
    }
}
