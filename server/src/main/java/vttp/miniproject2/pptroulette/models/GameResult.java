package vttp.miniproject2.pptroulette.models;

import lombok.Data;
import org.springframework.jdbc.support.rowset.SqlRowSet;

@Data
public class GameResult {

  private String gameId;
  private String speakerName;
  private String assistantName;
  private Integer score;

  public static GameResult fromRs(SqlRowSet rs) {
    GameResult gameResult = new GameResult();
    gameResult.setGameId(rs.getString("game_id"));
    gameResult.setSpeakerName(rs.getString("speaker_name"));
    gameResult.setAssistantName(rs.getString("assistant_name"));
    gameResult.setScore(rs.getInt("score"));
    return gameResult;
  }
}
