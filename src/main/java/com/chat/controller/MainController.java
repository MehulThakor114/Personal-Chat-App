package com.chat.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.chat.model.LoginModel;

import jakarta.servlet.http.HttpSession;

@Controller
public class MainController {

	private static final List<String> username = List.of("xyzmehul_5928", "sweetu");
	private static final String password = "mehul@5928";

	@GetMapping("/")
	public String home(HttpSession session) {
		if (session.getAttribute("user") != null && username.contains(session.getAttribute("user").toString())) {
			return "chat";
		}
		return "welcome";
	}

	@PostMapping("/login")
	public String home(@RequestBody LoginModel loginModel, HttpSession session) {

		if (username.contains(loginModel.getUsername()) && password.equalsIgnoreCase(loginModel.getPassword())) {
			session.setAttribute("user", loginModel.getUsername());
			return "chat";
		}
		return "welcome";
	}
}