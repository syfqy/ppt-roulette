package vttp.miniproject2.pptroulette.services;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
}
