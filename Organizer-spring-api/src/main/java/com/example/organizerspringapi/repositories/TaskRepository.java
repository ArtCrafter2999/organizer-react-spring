package com.example.organizerspringapi.repositories;

import com.example.organizerspringapi.entities.Task;
import com.example.organizerspringapi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
}
