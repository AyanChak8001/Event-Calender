package com.example.calendar.model;

public class Event {
    private String id;
    private String title;
    private String date; // YYYY-MM-DD
    private String time; // HH:mm (24-hour)
    private int durationMinutes; // duration in minutes
    private String description;

    public Event() {}

    public Event(String id, String title, String date, String time, int durationMinutes, String description) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.time = time;
        this.durationMinutes = durationMinutes;
        this.description = description;
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
