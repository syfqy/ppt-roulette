package vttp.miniproject2.pptroulette.models;

import java.util.List;
import lombok.Data;

@Data
public class Lobby {

  public static final Integer MAX_NUM_PLAYERS = 5;
  public static final Integer MIN_NUM_PLAYERS = 3;

  private String gameId;
  private List<Player> players;
  private String hostName;
  private boolean canStartGame = false;

  // TODO: Allow for selection of player
  private void setSpeaker() {
    players.get(0).setRole("Speaker");
  }

  private void setAssistant() {
    players.get(1).setRole("Assistant");
  }

  private void setJudges() {
    for (int i = 2; i < players.size(); i++) {
      players.get(i).setRole("Judge");
    }
  }

  public void setRoles() {
    setSpeaker();
    setAssistant();
    setJudges();
  }
  // public JsonObject toJson () {

  //   JsonArray playerArr =

  //   return Json.createObjectBuilder()
  //   .add("gameId", gameId)
  //   .add(players, players.toJson())
  //   .build();
  // }

}
