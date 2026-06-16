package com.bestcrm.service;

import com.bestcrm.model.ContactNote;
import java.util.List;

public interface ContactNoteService {
    ContactNote addNote(Long contactId, String content, String userEmail);
    List<ContactNote> getNotesByContact(Long contactId);
    boolean deleteNote(Long contactId, Long noteId);
}
