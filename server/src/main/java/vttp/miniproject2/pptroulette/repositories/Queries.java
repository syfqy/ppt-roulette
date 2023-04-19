package vttp.miniproject2.pptroulette.repositories;

public class Queries {

  public static final String SQL_INSERT_GAME_RESULT =
    """
        INSERT INTO game_results (game_id, speaker_name, assistant_name, score)
        VALUES (?, ?, ?, ?)
            """;
}
