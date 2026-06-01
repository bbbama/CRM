package com.bestcrm.service;

import com.bestcrm.model.CompanyContact;
import com.bestcrm.model.Partner;
import com.bestcrm.repository.CompanyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyContactService {

    private final CompanyContactRepository companyContactRepository;
    private final PartnerService partnerService;

    public List<CompanyContact> getAllContacts() {
        return companyContactRepository.findAll();
    }

    public Optional<CompanyContact> getContactById(Long id) {
        return companyContactRepository.findById(id);
    }

    public CompanyContact saveContact(CompanyContact contact) {
        // Jeśli kontakt ma przypisanego pracodawcę (Partnera), pobieramy go z bazy,
        // aby uniknąć nadpisania danych partnera pustymi polami (tzw. shallow save).
        if (contact.getEmployer() != null && contact.getEmployer().getId() != null) {
            Partner fullPartner = partnerService.getPartnerById(contact.getEmployer().getId())
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono partnera o ID: " + contact.getEmployer().getId()));
            contact.setEmployer(fullPartner);
        }
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
