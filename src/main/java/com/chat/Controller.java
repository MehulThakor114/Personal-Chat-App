package com.chat;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class Controller {

	@GetMapping("hello")
	public String hello() {
		return "Hi Mehul here";
	}

	static Map<String, byte[]> map = new HashMap<String, byte[]>();

	@PostMapping("/upload")
	public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {

		String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
		map.put(fileName, file.getBytes());
		String fileUrl = "download/" + fileName;
		return ResponseEntity.ok(fileUrl);
	}

	@GetMapping("/download/{fileName}")
	public ResponseEntity<?> downloadFile(@PathVariable String fileName) throws IOException {
		ByteArrayResource resource = new ByteArrayResource(map.get(fileName));

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
				.contentLength(resource.contentLength()).body(resource);
	}
}
