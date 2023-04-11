package vttp.miniproject2.pptroulette.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.Image;
import vttp.miniproject2.pptroulette.repositories.DeckMaterialsRepository;

@Service
public class ImageService {

  @Autowired
  private DeckMaterialsRepository deckMaterialsRepo;

  @Autowired
  private PexelsAPIService pexelsAPIService;

  public List<Image> getImagesByUser(String userId) {
    return deckMaterialsRepo.getImagesByUser(userId);
  }

  public List<String> searchImages(String query) {
    return pexelsAPIService.searchImages(query);
  }

  public boolean saveImage(Image image) {
    return deckMaterialsRepo.insertImage(image) != null;
  }

  public void deleteImage() {}
}
