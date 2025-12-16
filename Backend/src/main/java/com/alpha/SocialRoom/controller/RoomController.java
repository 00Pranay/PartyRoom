package com.alpha.SocialRoom.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alpha.SocialRoom.services.RoomService;



@RestController
@RequestMapping("/api/room")
public class RoomController {
    private final RoomService roomservice;

    public RoomController(RoomService roomService)
    {
        this.roomservice = roomService;
    }
    @PostMapping("/create")
    public String CreateRoom() {
        return roomservice.CreateRoom();   
    }

    @GetMapping("/exists/{code}")
    public boolean roomExists(@PathVariable String code) {
        return roomservice.exists(code);
    }
    
}
