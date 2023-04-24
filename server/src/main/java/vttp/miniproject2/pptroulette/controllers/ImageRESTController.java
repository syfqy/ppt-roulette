package vttp.miniproject2.pptroulette.controllers;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import java.util.List;
import java.util.UUID;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vttp.miniproject2.pptroulette.models.Image;
import vttp.miniproject2.pptroulette.services.ImageService;

@RestController
@RequestMapping(path = "/api/image")
public class ImageRESTController {

  @Autowired
  private ImageService imageService;

  @GetMapping("/{email}")
  public ResponseEntity<List<Image>> getImagesByUser(
    @PathVariable String email
  ) {
    System.out.println(">>> getting images for user " + email);

    List<Image> images = imageService.getImagesByUser(email);
    return ResponseEntity.ok(images);
  }

  @GetMapping("/count/{email}")
  public ResponseEntity<Integer> getImageCountByUser(
    @PathVariable String email
  ) {
    System.out.println(">>> getting image counts for user " + email);

    Integer nImages = imageService.getImageCountByUser(email);
    return ResponseEntity.ok(nImages);
  }

  @GetMapping("/search")
  public List<String> searchImage(
    @RequestParam String query,
    @RequestParam Integer limit
  ) {
    System.out.println(">>> searching for images: " + query);
    return imageService.searchImages(query, limit);
  }

  @PostMapping("/save")
  public ResponseEntity<String> saveImage(@RequestBody String body) {
    JsonReader reader = Json.createReader(new StringReader(body));
    JsonObject json = reader.readObject();

    String imageUrl = json.getString("imageUrl");
    String username = json.getString("username");

    System.out.println(">>> saving image " + imageUrl);

    Image image = new Image();
    image.setImageId(UUID.randomUUID().toString().substring(0, 8));
    image.setUsername(username);
    image.setImageUrl(imageUrl);

    if (!imageService.saveImage(image)) {
      JsonObject resp = Json
        .createObjectBuilder()
        .add("message", "Image was not saved successfully")
        .build();
      return ResponseEntity
        .status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
        .body(resp.toString());
    }

    JsonObject resp = Json
      .createObjectBuilder()
      .add("message", "Image saved")
      .build();

    return ResponseEntity.status(HttpStatus.SC_CREATED).body(resp.toString());
  }

  @DeleteMapping("/{imageId}")
  // TODO: implement delete image
  public ResponseEntity<String> deleteImage(@PathVariable String imageId) {
    System.out.println(">>> deleting image " + imageId);

    if (!imageService.deleteImage(imageId)) {
      JsonObject resp = Json
        .createObjectBuilder()
        .add("message", "Image was not deleted")
        .build();

      return ResponseEntity
        .status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
        .body(resp.toString());
    }

    JsonObject resp = Json
      .createObjectBuilder()
      .add("message", "Image deleted successfully")
      .build();

    return ResponseEntity.ok(resp.toString());
  }
}
