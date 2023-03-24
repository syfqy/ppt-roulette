package vttp.miniproject2.pptroulette.models;

import java.util.List;
import lombok.Data;

@Data
public class Deck {

  private String topic;
  private List<String> prompts;
  private List<Image> images;
}
