package com.bestcrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventEditionDTO {
    private Long id;
    private Integer edition;
    private LocalDate startingDate;
    private LocalDate endingDate;
    private String localisation;
    private String description;
}
