package vttp.miniproject2.pptroulette.models;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import lombok.Data;
import vttp.miniproject2.pptroulette.exceptions.PlayerNotFoundException;

@Data
public class Lobby {

  public static final Integer MAX_NUM_PLAYERS = 5;
  public static final Integer MIN_NUM_PLAYERS = 3;

  private String gameId;
  private List<Player> players = new LinkedList<Player>();
  private String hostName;
  private boolean canStartGame = false;

  public void assignRole(String playerName, String role)
    throws PlayerNotFoundException {
    Optional<Player> opt = players
      .stream()
      .filter(p -> p.getName().equals(playerName))
      .findFirst();

    if (opt.isEmpty()) {
      throw new PlayerNotFoundException(
        "Player: %s not found in lobby".formatted(playerName)
      );
    }

    opt.get().setRole(role);
  }

  public void assignRole(Integer playerIdx, String role) {
    players.get(playerIdx).setRole(role);
  }

  public void addPlayer(Player player) {
    players.add(player);
  }

  public void removePlayer(String playerName) {
    this.players =
      this.players.stream()
        .filter(p -> !p.getName().equals(playerName))
        .toList();
  }
}
