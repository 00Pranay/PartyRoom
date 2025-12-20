package com.alpha.SocialRoom.services;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class RoomService {
    private final Set<String> room = new HashSet<>();

    public String CreateRoom(){
        String roomcode=UUID.randomUUID().toString().substring(0,6);
        room.add(roomcode);
        return roomcode;
    }
    public boolean exists(String roomcode){
        return room.contains(roomcode);
    }
}
