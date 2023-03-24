package vttp.miniproject2.pptroulette.models;

import java.util.List;
import lombok.Data;

@Data
public class Game {

  private String gameId;
  private Player speaker;
  private Player assistant;
  private List<Player> judges;
  private String topic;
  private List<String> prompts;
  private List<String> imageUrls;
}
