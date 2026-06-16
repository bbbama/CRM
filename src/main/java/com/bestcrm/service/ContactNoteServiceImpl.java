package com.bestcrm.service;

import com.bestcrm.model.CompanyContact;
import com.bestcrm.model.ContactNote;
import com.bestcrm.model.Member;
import com.bestcrm.repository.CompanyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactNoteServiceImpl implements ContactNoteService {

    private final CompanyContactRepository companyContactRepository;
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
        note.setAuthor(author);

        contact.getNotes().add(note);
        companyContactRepository.save(contact);

        return note;
    }

    public List<ContactNote> getNotesByContact(Long contactId) {
        CompanyContact contact = companyContactService.getContactById(contactId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono kontaktu o ID: " + contactId));
        return contact.getNotes();
    }

    public boolean deleteNote(Long contactId, Long noteId) {
        CompanyContact contact = companyContactService.getContactById(contactId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono kontaktu o ID: " + contactId));
        boolean removed = contact.getNotes().removeIf(n -> n.getId().equals(noteId));
        if (removed) {
            companyContactRepository.save(contact);
            return true;
        }
        return false;
    }
}
