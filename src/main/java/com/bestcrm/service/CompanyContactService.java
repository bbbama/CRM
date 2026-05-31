package com.bestcrm.service;

import com.bestcrm.model.CompanyContact;
import com.bestcrm.repository.CompanyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyContactService {

    private final CompanyContactRepository companyContactRepository;

    public List<CompanyContact> getAllContacts() {
        return companyContactRepository.findAll();
    }

    public Optional<CompanyContact> getContactById(Long id) {
        return companyContactRepository.findById(id);
    }

    public CompanyContact saveContact(CompanyContact contact) {
        return companyContactRepository.save(contact);
    }

    public boolean deleteContact(Long id) {
        if (companyContactRepository.existsById(id)) {
            companyContactRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<CompanyContact> getContactsByPartner(Long partnerId) {
        return companyContactRepository.findByEmployerId(partnerId);
    }
}
