package com.bestcrm.service;

import com.bestcrm.model.Member;
import java.util.List;
import java.util.Optional;

public interface MemberService {
    List<Member> getAllMembers();
    Optional<Member> getMemberById(Long id);
    Optional<Member> getMemberByEmail(String email);
    Member saveMember(Member member);
    boolean deleteMember(Long id);
}
