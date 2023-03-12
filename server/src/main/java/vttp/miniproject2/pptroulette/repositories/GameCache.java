package vttp.miniproject2.pptroulette.repositories;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import vttp.miniproject2.pptroulette.models.Player;

@Repository
public class GameCache {

  @Autowired
  @Qualifier("GAME_CACHE")
  private RedisTemplate<String, String> redisTemplate;

  public boolean createGame(String gameId) {
    return redisTemplate.opsForSet().add("ongoingGames", gameId) > 0;
  }

  public boolean removeGame(String gameId) {
    return redisTemplate.opsForSet().remove("ongoingGames", gameId) > 0;
  }

  public boolean isGameOngoing(String gameId) {
    return redisTemplate.opsForSet().isMember("ongoingGames", gameId);
  }

  public List<Player> addPlayer(Player player, String gameId) {
    Long numOfPlayers = redisTemplate.opsForList().size(gameId);

    // game exists and still available slots, then add new player
    if (isGameOngoing(gameId) && numOfPlayers < 5) {
      System.out.println(
        ">>> %d slot(s) available, joining game".formatted(5 - numOfPlayers)
      );
      redisTemplate.opsForList().rightPush(gameId, player.toJson().toString());
    }

    List<Player> players = redisTemplate
      .opsForList()
      .range(gameId, 0, -1)
      .stream()
      .map(p -> {
        JsonReader reader = Json.createReader(new StringReader(p));
        JsonObject json = reader.readObject();
        return json;
      })
      .map(json -> Player.fromJson(json))
      .toList();
    return players;
  }
}
