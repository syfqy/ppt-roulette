package vttp.miniproject2.pptroulette.models;

import lombok.Data;

@Data
public class GameResult {

  private String gameId;
  private String speakerName;
  private String assistantName;
  private Integer score;
}
