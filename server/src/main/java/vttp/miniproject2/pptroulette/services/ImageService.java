package vttp.miniproject2.pptroulette.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.Image;
import vttp.miniproject2.pptroulette.repositories.DeckRepository;

@Service
public class ImageService {

  @Autowired
  private DeckRepository deckRepository;

  public List<Image> getImagesByUser(String userId) {
    return deckRepository.getImagesByUser(userId);
  }

  public void searchImage(String query) {}

  public void uploadImage() {}

  public void deleteImage() {}
}
