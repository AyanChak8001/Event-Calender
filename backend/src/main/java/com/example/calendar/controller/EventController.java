package com.example.calendar.controller;

import com.example.calendar.model.Event;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin // allow all origins for simplicity (restrict in production)
public class EventController {

    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping(value = "/events", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Event> getEvents() throws IOException {
        ClassPathResource resource = new ClassPathResource("events.json");
        return mapper.readValue(resource.getInputStream(), new TypeReference<List<Event>>(){});
    }
}
