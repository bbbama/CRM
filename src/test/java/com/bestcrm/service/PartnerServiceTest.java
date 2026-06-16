package com.bestcrm.service;

import com.bestcrm.model.Partner;
import com.bestcrm.model.PartnerStatus;
import com.bestcrm.repository.PartnerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PartnerServiceTest {

    @Mock
    private PartnerRepository partnerRepository;

    private PartnerService partnerService;

    @BeforeEach
    void setUp() {
        partnerService = new PartnerServiceImpl(partnerRepository);
    }

    @Test
    void shouldReturnAllPartners() {
        when(partnerRepository.findAll()).thenReturn(List.of(new Partner()));
        List<Partner> result = partnerService.getAllPartners();
        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnPartnerById() {
        Partner partner = new Partner();
        partner.setName("Test Partner");
        when(partnerRepository.findById(1L)).thenReturn(Optional.of(partner));

        Optional<Partner> result = partnerService.getPartnerById(1L);
        assertTrue(result.isPresent());
        assertEquals("Test Partner", result.get().getName());
    }

    @Test
    void shouldReturnEmptyWhenNotFound() {
        when(partnerRepository.findById(99L)).thenReturn(Optional.empty());
        assertTrue(partnerService.getPartnerById(99L).isEmpty());
    }

    @Test
    void shouldSavePartner() {
        Partner partner = new Partner();
        partner.setName("New Partner");
        when(partnerRepository.save(any())).thenReturn(partner);

        Partner result = partnerService.savePartner(partner);
        assertEquals("New Partner", result.getName());
    }

    @Test
    void shouldDeleteExistingPartner() {
        when(partnerRepository.existsById(1L)).thenReturn(true);
        doNothing().when(partnerRepository).deleteById(1L);

        assertTrue(partnerService.deletePartner(1L));
        verify(partnerRepository).deleteById(1L);
    }

    @Test
    void shouldReturnFalseWhenDeletingNonExistent() {
        when(partnerRepository.existsById(99L)).thenReturn(false);
        assertFalse(partnerService.deletePartner(99L));
    }

    @Test
    void shouldSearchByName() {
        when(partnerRepository.findByNameContainingIgnoreCase("test"))
                .thenReturn(List.of(new Partner()));
        assertEquals(1, partnerService.searchPartnersByName("test").size());
    }

    @Test
    void shouldFindByIndustry() {
        when(partnerRepository.findByIndustry("IT"))
                .thenReturn(List.of(new Partner()));
        assertEquals(1, partnerService.getPartnersByIndustry("IT").size());
    }
}
