package com.alpha.SocialRoom.websockets;

import java.util.Map;
import tools.jackson.databind.ObjectMapper;

public class Json {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static Map<String, Object> parse(String json) throws Exception {
        return mapper.readValue(json, Map.class);
    }

    public static String stringify(Object obj) throws Exception {
        return mapper.writeValueAsString(obj);
    }
}
