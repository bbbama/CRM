package com.bestcrm.service;

import com.bestcrm.model.Partner;
import java.util.List;
import java.util.Optional;

public interface PartnerService {
    List<Partner> getAllPartners();
    Optional<Partner> getPartnerById(Long id);
    Partner savePartner(Partner partner);
    boolean deletePartner(Long id);
    List<Partner> getPartnersByIndustry(String industry);
    List<Partner> searchPartnersByName(String name);
}
