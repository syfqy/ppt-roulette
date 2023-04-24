package vttp.miniproject2.pptroulette.repositories;

import static vttp.miniproject2.pptroulette.repositories.Queries.*;

import java.util.LinkedList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
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

  public GameResult getGameResult(String gameId) {
    final SqlRowSet rs = jdbcTemplate.queryForRowSet(
      SQL_SELECT_GAME_RESULT_BY_GAME_ID,
      gameId
    );

    rs.next();

    GameResult gameResult = GameResult.fromRs(rs);
    return gameResult;
  }

  public List<GameResult> getGameResults(Integer limit, Integer offset) {
    final SqlRowSet rs = jdbcTemplate.queryForRowSet(
      SQL_SELECT_TOP_GAME_RESULTS,
      limit,
      offset
    );

    List<GameResult> gameResults = new LinkedList<>();

    while (rs.next()) {
      gameResults.add(GameResult.fromRs(rs));
    }

    return gameResults;
  }
}
