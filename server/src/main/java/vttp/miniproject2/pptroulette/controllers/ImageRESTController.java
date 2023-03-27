package vttp.miniproject2.pptroulette.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

  @GetMapping("/{userId}")
  public ResponseEntity<List<Image>> getImagesByUser(
    @PathVariable String userId
  ) {
    // TODO: require auth
    System.out.println(">>> getting images for user " + userId);

    List<Image> images = imageService.getImagesByUser(userId);
    return ResponseEntity.ok(images);
  }

  @GetMapping("/search")
  public List<String> searchImage(@RequestParam String query) {
    System.out.println(">>> searching for images: " + query);
    return null;
  }

  @DeleteMapping("/{imageId}")
  public void deleteImage(@PathVariable String imageId) {
    System.out.println(">>> deleting image " + imageId);
  }
}
