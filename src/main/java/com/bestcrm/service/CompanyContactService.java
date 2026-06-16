package com.bestcrm.service;

import com.bestcrm.model.CompanyContact;
import java.util.List;
import java.util.Optional;

public interface CompanyContactService {
    List<CompanyContact> getAllContacts();
    Optional<CompanyContact> getContactById(Long id);
    CompanyContact saveContact(CompanyContact contact);
    boolean deleteContact(Long id);
    List<CompanyContact> getContactsByPartner(Long partnerId);
}
