package vttp.miniproject2.pptroulette.models;

import java.util.List;
import lombok.Data;

@Data
public class Lobby {

  private String gameId;
  private List<Player> players;
  private String hostName;
}
