package vttp.miniproject2.pptroulette.models;

import java.util.List;
import lombok.Data;

@Data
public class Game {

  private String gameId;
  private Player speaker;
  private Player assistant;
  private List<Player> judges;
  private DeckMaterials deckMaterials;
  //TODO: time can be moved to client side
  private Integer timePerSlide = 10;

  public Game(Lobby lobby) {
    this.gameId = lobby.getGameId();
    this.speaker = lobby.getPlayerByRole("speaker").get(0);
    this.assistant = lobby.getPlayerByRole("assistant").get(0);
    this.judges = lobby.getPlayerByRole("judge");
  }
}
