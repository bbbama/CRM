package com.bestcrm.service;

import com.bestcrm.model.Partner;
import com.bestcrm.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerRepository partnerRepository;

    // Pobierz wszystkich partnerów
    public List<Partner> getAllPartners() {
        return partnerRepository.findAll();
    }

    // Znajdź partnera po ID
    public Optional<Partner> getPartnerById(Long id) {
        return partnerRepository.findById(id);
    }

    // Zapisz nowego partnera lub zaktualizuj istniejącego
    public Partner savePartner(Partner partner) {
        return partnerRepository.save(partner);
    }

    // Usuń partnera - zwraca true jeśli usunięto, false jeśli nie znaleziono
    public boolean deletePartner(Long id) {
        if (partnerRepository.existsById(id)) {
            partnerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Wyszukiwanie po branży
    public List<Partner> getPartnersByIndustry(String industry) {
        return partnerRepository.findByIndustry(industry);
    }

    // Wyszukiwanie po nazwie
    public List<Partner> searchPartnersByName(String name) {
        return partnerRepository.findByNameContainingIgnoreCase(name);
    }
}
