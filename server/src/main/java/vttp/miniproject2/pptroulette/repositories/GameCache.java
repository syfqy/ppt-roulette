package vttp.miniproject2.pptroulette.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

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
}
