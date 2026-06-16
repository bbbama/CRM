package com.bestcrm.dto;

import com.bestcrm.model.InteractionType;
import com.bestcrm.model.CooperationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InteractionDTO {
    private Long id;
    private InteractionType type;
    private LocalDateTime date;
    private String note;
    private CooperationStatus status;
    private boolean isResponsive;
}
