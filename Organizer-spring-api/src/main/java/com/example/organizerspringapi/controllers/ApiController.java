package com.example.organizerspringapi.controllers;

import com.example.organizerspringapi.authorization.Authorized;
import com.example.organizerspringapi.authorization.SecretKeyHolder;
import com.example.organizerspringapi.entities.*;
import com.example.organizerspringapi.repositories.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import io.jsonwebtoken.*;
import org.springframework.http.*;

import java.util.*;

@RestController
@RequestMapping("/api") // Update the base URL to "/api" for all endpoints
public class ApiController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private TaskRepository taskRepository;

    @PostMapping("/signUpUser")
    public ResponseEntity<Object> signUpUser(@RequestBody User user) {
        User existingUser = userRepository.findByLogin(user.getLogin());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body("Користувач з таким логіном вже зареєстрований");
        }
        //user.setPassword(PasswordHasher.hashPassword(user.getPassword()));
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser.getId());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/signInUser")
    public ResponseEntity<Object> signInUser(@RequestBody User user) {
        User authenticatedUser = userRepository.findByLoginAndPassword(user.getLogin(), user.getPassword());
        //User authenticatedUser = userRepository.findByLogin(user.getLogin());
        if (authenticatedUser == null)
            return ResponseEntity.badRequest().body("Невірний логін або пароль");
//        if(!PasswordHasher.verifyPassword(user.getPassword(), authenticatedUser.getPassword()))
//            return ResponseEntity.badRequest().body("Невірний логін або пароль");

        String token = generateToken(authenticatedUser.getId());
        return ResponseEntity.ok(token);
    }

    @GetMapping("/getAllEvents")
    @Authorized
    public ResponseEntity<Object> getAllEvents(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        List<Event> events = eventRepository.findByUser(user);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/saveEvent")
    @Authorized
    public ResponseEntity<Object> saveEvent(@RequestBody Event event, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        event.setUser(user);
        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.ok(savedEvent);
    }

    @DeleteMapping("/removeEvent/{eventId}")
    @Authorized
    public ResponseEntity<Object> removeEvent(@PathVariable Long eventId, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isEmpty()) {
            return ResponseEntity.badRequest().body("Подію не знайдено");
        }
        Event event = optionalEvent.get();
        if (!event.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Недостатньо прав для видалення події");
        }
        eventRepository.delete(event);
        return ResponseEntity.ok("Подію видалено");
    }

    @GetMapping("/getAllTasks")
    @Authorized
    public ResponseEntity<Object> getAllTasks(HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        List<Task> tasks = taskRepository.findByUser(user);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/saveTasks")
    @Authorized
    public ResponseEntity<Object> saveTasks(@RequestBody TaskArray body, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        Task[] tasks = body.getTasks();
//        tasks.forEach((t) -> t.setUser(user));
        for (int i = 0; i < tasks.length; i++) {
            tasks[i].setUser(user);
            tasks[i].setIndex(i);
        }
        taskRepository.saveAll(Arrays.stream(tasks).toList());
        return ResponseEntity.ok("Задачі збережено");
    }
    @PostMapping("/saveTask")
    @Authorized
    public ResponseEntity<Object> saveTask(@RequestBody Task task, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");
        task.setUser(user);
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @DeleteMapping("/removeTask/{taskId}")
    @Authorized
    public ResponseEntity<Object> removeTask(@PathVariable Long taskId, HttpServletRequest request) {
        User user = (User) request.getAttribute("user");

        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (optionalTask.isEmpty()) {
            return ResponseEntity.badRequest().body("Подію не знайдено");
        }

        Task task = optionalTask.get();
        if (!task.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Недостатньо прав для видалення події");
        }
        taskRepository.delete(task);
        return ResponseEntity.ok("Подію видалено");
    }

    private String generateToken(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 86400000); // Token expires in 24 hours

        byte[] signingKey = SecretKeyHolder.SECRET_KEY.getBytes(StandardCharsets.UTF_8);

        return Jwts.builder()
                .setSubject(userId.toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS256)
                .compact();
    }

    @GetMapping("/checkAuthorization")
    @Authorized
    public ResponseEntity<Object> checkAuthorization(HttpServletRequest request) {
        return ResponseEntity.ok(request.getAttribute("user"));
    }

}
