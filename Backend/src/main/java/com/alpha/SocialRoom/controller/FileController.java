package com.alpha.SocialRoom.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final String UPLOAD_DIR = "uploads/";

    public FileController() throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
    }

    // Upload file
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) {

        try {
            Path userDir = Paths.get(UPLOAD_DIR, username.toLowerCase());
            Files.createDirectories(userDir);

            Path path = userDir.resolve(file.getOriginalFilename());
            file.transferTo(path);

            return ResponseEntity.ok(Map.of("message", "File uploaded successfully"));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload file"));
        }
    }

    // List files
    @GetMapping("/list")
    public ResponseEntity<String[]> listFiles(@RequestParam("username") String username) {
        try {
            Path userDir = Paths.get(UPLOAD_DIR, username.toLowerCase());
            if (!Files.exists(userDir)) return ResponseEntity.ok(new String[]{});

            String[] files = new File(userDir.toString()).list();
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Download file
    @GetMapping("/download/{username}/{filename}")
    public ResponseEntity<byte[]> downloadFile(
            @PathVariable String username,
            @PathVariable String filename) {

        try {
            Path path = Paths.get(UPLOAD_DIR, username.toLowerCase(), filename);
            if (!Files.exists(path)) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

            byte[] data = Files.readAllBytes(path);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);

            return new ResponseEntity<>(data, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Share file to another user
   @PostMapping("/share")
public ResponseEntity<Map<String, String>> shareFile(@RequestBody Map<String, String> body) {
    String fromUser = body.get("fromUser");
    String toUser = body.get("toUser");
    String filename = body.get("filename");

    if (fromUser == null || toUser == null || filename == null)
        return ResponseEntity.badRequest().body(Map.of("message", "fromUser, toUser, and filename are required"));

    Path source = Paths.get(UPLOAD_DIR, fromUser.toLowerCase(), filename);
    Path target = Paths.get(UPLOAD_DIR, toUser.toLowerCase(), filename);

    try {
        if (!Files.exists(source))
            return ResponseEntity.badRequest().body(Map.of("message", "File does not exist"));

        Files.createDirectories(target.getParent());
        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);

        return ResponseEntity.ok(Map.of("message", "File shared successfully"));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(Map.of("message", "Failed to share file"));
    }
}
@PostMapping("/delete")
public ResponseEntity<?> deleteFile(@RequestBody Map<String, String> body) {
    try {
        String username = body.get("username");
        String filename = body.get("filename");

        if (username == null || filename == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username and filename required"));
        }

        Path path = Paths.get("uploads", username.toLowerCase(), filename);
        if (!Files.exists(path)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "File not found"));
        }

        Files.delete(path);
        return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to delete file"));
    }
}
@GetMapping("/preview/{username}/{filename}")
public ResponseEntity<byte[]> previewFile(
        @PathVariable String username,
        @PathVariable String filename) throws IOException {

    Path path = Paths.get("uploads", username.toLowerCase(), filename);
    if (!Files.exists(path)) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    byte[] data = Files.readAllBytes(path);
    HttpHeaders headers = new HttpHeaders();

    String ext = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    if (ext.equals("pdf")) headers.setContentType(MediaType.APPLICATION_PDF);
    else if (ext.matches("jpg|jpeg")) headers.setContentType(MediaType.IMAGE_JPEG);
    else if (ext.equals("png")) headers.setContentType(MediaType.IMAGE_PNG);
    else headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

    // Do NOT set Content-Disposition: attachment → prevents auto-download
    return new ResponseEntity<>(data, headers, HttpStatus.OK);
}
}