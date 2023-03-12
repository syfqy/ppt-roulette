package vttp.miniproject2.pptroulette.services;

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.Player;
import vttp.miniproject2.pptroulette.repositories.GameCache;

@Service
public class GameService {

  @Autowired
  private GameCache gameCache;

  public String createGame(String hostName) {
    String gameId = UUID.randomUUID().toString().substring(0, 4);

    while (!gameCache.createGame(gameId)) {
      System.out.println(
        ">>> gameId %s already exists, generating new gameId".formatted(gameId)
      );
      gameId = UUID.randomUUID().toString().substring(0, 4);
    }

    return gameId;
  }

  public List<Player> addPlayer(Player player, String gameId) {
    return gameCache.addPlayer(player, gameId);
  }

  public boolean isGameOngoing(String gameId) {
    return gameCache.isGameOngoing(gameId);
  }
}
