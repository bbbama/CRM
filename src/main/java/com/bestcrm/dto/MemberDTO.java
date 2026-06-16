package com.bestcrm.dto;

import com.bestcrm.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
}
