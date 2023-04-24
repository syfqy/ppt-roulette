package vttp.miniproject2.pptroulette.repositories;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import vttp.miniproject2.pptroulette.models.Lobby;

@Repository
public class GameCache {

  //TODO: Set TTL on lobbies

  @Autowired
  @Qualifier("GAME_CACHE")
  private RedisTemplate<String, String> redisTemplate;

  @Autowired
  private Gson gson;

  private static final String LOBBY_SET_KEY = "lobbies";
  private static final String GAME_SET_KEY = "games";

  public Lobby getLobby(String gameId) {
    String result = redisTemplate.opsForValue().get(gameId);
    return gson.fromJson(result, Lobby.class);
  }

  public void removeLobby(String gameId) {
    redisTemplate.opsForValue().getAndDelete(gameId);
  }

  public void upsertLobby(Lobby lobby) {
    redisTemplate.opsForValue().set(lobby.getGameId(), gson.toJson(lobby));
  }

  public boolean openLobby(String gameId) {
    return redisTemplate.opsForSet().add(LOBBY_SET_KEY, gameId) > 0;
  }

  public boolean closeLobby(String gameId) {
    return redisTemplate.opsForSet().remove(LOBBY_SET_KEY, gameId) > 0;
  }

  public boolean isLobbyOpen(String gameId) {
    return redisTemplate.opsForSet().isMember(LOBBY_SET_KEY, gameId);
  }

  public boolean startGame(String gameId) {
    return redisTemplate.opsForSet().add(GAME_SET_KEY, gameId) > 0;
  }

  public boolean isGameCreated(String gameId) {
    return redisTemplate.opsForSet().isMember(GAME_SET_KEY, gameId);
  }

  public boolean endGame(String gameId) {
    return redisTemplate.opsForSet().remove(GAME_SET_KEY, gameId) > 0;
  }
}
