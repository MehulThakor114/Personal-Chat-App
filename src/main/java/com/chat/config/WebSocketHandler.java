package com.chat.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.chat.model.Message;
import com.fasterxml.jackson.databind.ObjectMapper;

public class WebSocketHandler extends TextWebSocketHandler {

	private static final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
	private static List<Message> msg = new ArrayList<>();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) {
		sessions.add(session);
		String user = (String) session.getAttributes().get("user");
		for (Message message : msg) {
			try {
				String payload = message.getMessage().getPayload();

				Map<String, Object> response = new HashMap<>();
				response.put("text", payload);
				response.put("class", user.equalsIgnoreCase(message.getUser()) ? "user" : "other");

				ObjectMapper mapper = new ObjectMapper();
				String json = mapper.writeValueAsString(response);

				session.sendMessage(new TextMessage(json));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {

		Map<String, Object> attributes = session.getAttributes();
		String user = (String) attributes.get("user");
		Message customMsg = new Message();
		customMsg.setUser(user);
		customMsg.setMessage(message);
		customMsg.setDateTime(LocalDateTime.now());
		msg.add(customMsg);

		for (WebSocketSession s : sessions) {
			if (s.isOpen() && !s.getId().equals(session.getId())) {
				String payload = message.getPayload();

				Map<String, Object> response = new HashMap<>();
				response.put("text", payload);
				response.put("class", "other");

				ObjectMapper mapper = new ObjectMapper();
				String json = mapper.writeValueAsString(response);

				s.sendMessage(new TextMessage(json));
			}
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
		sessions.remove(session);
	}

	public static void removeMsg() {
		for (int i = 0; i < msg.size(); i++)
			msg.remove(i);
	}
}