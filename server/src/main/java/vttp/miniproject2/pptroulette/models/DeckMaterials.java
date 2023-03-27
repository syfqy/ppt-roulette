package vttp.miniproject2.pptroulette.models;

import java.util.List;
import lombok.Data;

@Data
public class DeckMaterials {

  private Topic topic;
  private List<Prompt> prompts;
  private List<List<Image>> imageLists;
}
