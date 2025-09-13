package com.certificaufu.certifica_ufu_backend.controllers;

import com.certificaufu.certifica_ufu_backend.repositories.AuthUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/certificates")
public class CertificateController {

    @Autowired
    AuthUserRepository authUserRepository;
}
