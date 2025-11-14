package com.chat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.chat.model.LoginModel;

import jakarta.servlet.http.HttpSession;

@Controller
public class MainController {

	private static final String username = "xyzmehul_5928";
	private static final String password = "mehul@5928";

	@GetMapping("/")
	public String home(HttpSession session) {
		if (session.getAttribute("user") != null
				&& session.getAttribute("user").toString().equalsIgnoreCase(username)) {
			return "chat";
		}
		return "welcome";
	}

	@PostMapping("/login")
	public String home(@RequestBody LoginModel loginModel, HttpSession session) {

		if (username.equalsIgnoreCase(loginModel.getUsername())
				&& password.equalsIgnoreCase(loginModel.getPassword())) {
			session.setAttribute("user", loginModel.getUsername());
			return "chat";
		}
		return "welcome";
	}
}