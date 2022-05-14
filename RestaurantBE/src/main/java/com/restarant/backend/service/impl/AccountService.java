package com.restarant.backend.service.impl;

import com.restarant.backend.entity.Account;
import com.restarant.backend.entity.Customer;
import com.restarant.backend.repository.AccountRepository;
import com.restarant.backend.repository.CustomerRepository;
import com.restarant.backend.service.IAccountService;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public AccountService(AccountRepository accountRepository, CustomerRepository customerRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public Account createAccount(Account account) {
        if(accountRepository.getByLogin(account.getLogin()) != null){
            return null;
        }
        Account result =accountRepository.save(account);
        Customer customer = new Customer();
        customer.setName(result.getLogin());
        customer.setAccount(result);
        Customer customer1 = customerRepository.save(customer);
        result.setCustomer(customer1);
        accountRepository.save(result);
        return result;
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
