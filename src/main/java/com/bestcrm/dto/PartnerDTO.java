package com.bestcrm.dto;

import com.bestcrm.model.PartnerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerDTO {
    private Long id;
    private String name;
    private String webPage;
    private String industry;
    private PartnerStatus status;
}
