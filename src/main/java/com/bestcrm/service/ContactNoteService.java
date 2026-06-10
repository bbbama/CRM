package com.bestcrm.service;

import com.bestcrm.model.CompanyContact;
import com.bestcrm.model.ContactNote;
import com.bestcrm.model.Member;
import com.bestcrm.repository.ContactNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactNoteService {

    private final ContactNoteRepository contactNoteRepository;
    private final CompanyContactService companyContactService;
    private final MemberService memberService;

    public ContactNote addNote(Long contactId, String content, String userEmail) {
        CompanyContact contact = companyContactService.getContactById(contactId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono kontaktu o ID: " + contactId));

        Member author = memberService.getMemberByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono zalogowanego użytkownika"));

        ContactNote note = new ContactNote();
        note.setContent(content);
        note.setCreatedAt(LocalDateTime.now());
        note.setContact(contact);
        note.setAuthor(author);

        return contactNoteRepository.save(note);
    }

    public List<ContactNote> getNotesByContact(Long contactId) {
        return contactNoteRepository.findByContactIdOrderByCreatedAtDesc(contactId);
    }

    public boolean deleteNote(Long id) {
        if (contactNoteRepository.existsById(id)) {
            contactNoteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
