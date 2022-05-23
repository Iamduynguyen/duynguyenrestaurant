package com.restarant.backend.service;

import com.restarant.backend.entity.Account;

public interface IAccountService {
    Account createAccount(Account account, String phone);

    Account getAccountById(Long id);

    Account getAccountByLogin(String login);
}
