package vttp.miniproject2.pptroulette.repositories;

import static vttp.miniproject2.pptroulette.repositories.Queries.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import vttp.miniproject2.pptroulette.models.GameResult;

@Repository
public class GameResultRepository {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public boolean insertGameResult(GameResult gameResult) {
    return (
      jdbcTemplate.update(
        SQL_INSERT_GAME_RESULT,
        gameResult.getGameId(),
        gameResult.getSpeakerName(),
        gameResult.getAssistantName(),
        gameResult.getScore()
      ) >
      1
    );
  }
}
