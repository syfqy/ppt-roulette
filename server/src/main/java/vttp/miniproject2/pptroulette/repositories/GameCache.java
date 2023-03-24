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

  public Lobby getLobby(String gameId) {
    String result = redisTemplate.opsForValue().get(gameId);
    return gson.fromJson(result, Lobby.class);
  }

  public void removeLobby(String gameId) {
    redisTemplate.opsForValue().getAndDelete(gameId);
    redisTemplate.opsForSet().remove("openLobbies", gameId);
  }

  public void upsertLobby(Lobby lobby) {
    redisTemplate.opsForValue().set(lobby.getGameId(), gson.toJson(lobby));
  }

  public boolean registerLobby(String gameId) {
    return redisTemplate.opsForSet().add("openLobbies", gameId) > 0;
  }

  public boolean isLobbyOpen(String gameId) {
    return redisTemplate.opsForSet().isMember("openLobbies", gameId);
  }
}
