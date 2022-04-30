package com.restarant.backend.service.impl;

import com.restarant.backend.entity.Account;
import com.restarant.backend.repository.AccountRepository;
import com.restarant.backend.security.jwt.JwtUtils;
import com.restarant.backend.service.IAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public Account createAccount(Account account) {
        if(accountRepository.getByLogin(account.getLogin()) != null){
            return null;
        }
        return accountRepository.save(account);
    }

    @Override
    public Account getAccountById(Long id) {
        return accountRepository.getById(id);
    }

    @Override
    public Account getAccountByLogin(String login) {
        return accountRepository.getByLogin(login);
    }
}
