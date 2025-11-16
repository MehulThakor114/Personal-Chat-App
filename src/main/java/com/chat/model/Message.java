package com.chat.model;

import java.time.LocalDateTime;

import org.springframework.web.socket.TextMessage;

public class Message {

	String user;
	TextMessage message;
	LocalDateTime dateTime;

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public TextMessage getMessage() {
		return message;
	}

	public void setMessage(TextMessage message) {
		this.message = message;
	}

	public LocalDateTime getDateTime() {
		return dateTime;
	}

	public void setDateTime(LocalDateTime dateTime) {
		this.dateTime = dateTime;
	}
}
