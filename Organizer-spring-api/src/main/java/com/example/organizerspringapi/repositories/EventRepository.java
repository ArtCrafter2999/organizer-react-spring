package com.example.organizerspringapi.repositories;

import com.example.organizerspringapi.entities.Event;
import com.example.organizerspringapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUser(User user);
}
