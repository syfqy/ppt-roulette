package vttp.miniproject2.pptroulette.services;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.Lobby;
import vttp.miniproject2.pptroulette.models.Player;
import vttp.miniproject2.pptroulette.repositories.GameCache;

@Service
public class LobbyService {

  @Autowired
  private GameCache gameCache;

  public Lobby getLobby(String gameId) {
    return gameCache.getLobby(gameId);
  }

  public boolean isLobbyOpen(String gameId) {
    return gameCache.isLobbyOpen(gameId);
  }

  public String createLobby(Player host) {
    String gameId = UUID.randomUUID().toString().substring(0, 4);

    while (!gameCache.openLobby(gameId)) {
      System.out.println(
        ">>> gameId %s already exists, generating new gameId".formatted(gameId)
      );
      gameId = UUID.randomUUID().toString().substring(0, 4);
    }

    Lobby lobby = new Lobby();
    lobby.setGameId(gameId);
    lobby.setHostName(host.getName());
    gameCache.upsertLobby(lobby);

    return gameId;
  }

  // TODO: throw exception if lobby is full
  public Lobby addPlayer(Player player, String gameId) {
    // get lobby from cache
    Lobby lobby = gameCache.getLobby(gameId);
    Integer numPlayers = lobby.getPlayers().size();

    // add player
    if (numPlayers == Lobby.MAX_NUM_PLAYERS) {
      System.out.println(
        ">>> Number of players in %s: %d, cannot join game".formatted(
            gameId,
            numPlayers
          )
      );
      return lobby;
    }

    System.out.println(
      ">>> Number of players in %s: %d, joining game...".formatted(
          gameId,
          numPlayers
        )
    );
    lobby.addPlayer(player);

    // assign roles
    if (lobby.getPlayers().size() >= Lobby.MIN_NUM_PLAYERS) {
      System.out.println(">>> Assigning roles");
      assignDefaultRoles(lobby);
    }

    // update ready and open status
    lobby.setCanStartGame(isLobbyReadyToStart(lobby));
    if (lobby.getPlayers().size() == Lobby.MAX_NUM_PLAYERS) {
      System.out.println(">>> Lobby: %s full, closing lobby".formatted(gameId));
      gameCache.closeLobby(gameId);
    }

    // save lobby
    gameCache.upsertLobby(lobby);

    return getLobby(gameId);
  }

  public Lobby removePlayer(Player player, String gameId) {
    Lobby lobby = gameCache.getLobby(gameId);

    if (!gameCache.isLobbyOpen(gameId)) return lobby;

    // if no players left, close and delete lobby
    if (lobby.getPlayers().size() <= 1) {
      gameCache.closeLobby(gameId);
      gameCache.removeLobby(gameId);
      return lobby;
    }

    lobby.removePlayer(player.getName());

    // clear roles if lobby has less than min players
    if (lobby.getPlayers().size() < Lobby.MIN_NUM_PLAYERS) lobby
      .getPlayers()
      .forEach(p -> p.setRole(null));

    // update ready and open status
    lobby.setCanStartGame(isLobbyReadyToStart(lobby));
    if (lobby.getPlayers().size() < Lobby.MAX_NUM_PLAYERS) gameCache.openLobby(
      gameId
    );

    gameCache.upsertLobby(lobby);

    return gameCache.getLobby(gameId);
  }

  private void assignDefaultRoles(Lobby lobby) {
    lobby.assignRole(0, "Speaker");
    lobby.assignRole(1, "Assistant");
    for (int i = 2; i < lobby.getPlayers().size(); i++) {
      lobby.assignRole(i, "Judge");
    }
  }

  private boolean isLobbyReadyToStart(Lobby lobby) {
    // lobby size check
    Integer numPlayers = lobby.getPlayers().size();
    if (
      numPlayers < Lobby.MIN_NUM_PLAYERS || numPlayers > Lobby.MAX_NUM_PLAYERS
    ) return false;

    // role check
    Map<String, Integer> roleCountsMap = new HashMap<String, Integer>();
    lobby
      .getPlayers()
      .forEach(player -> {
        roleCountsMap.merge(
          player.getRole().toLowerCase(),
          1,
          (t, u) -> Integer.sum(t, u)
        );
      });

    if (roleCountsMap.get("speaker") != 1) return false;
    if (roleCountsMap.get("assistant") != 1) return false;
    if (roleCountsMap.get("judge") != numPlayers - 2) return false;

    return true;
  }
}
