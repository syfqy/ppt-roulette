package vttp.miniproject2.pptroulette.repositories;

public class Queries {

  public static final String SQL_INSERT_GAME_RESULT =
    """
        INSERT INTO game_results (game_id, speaker_name, assistant_name, score)
        VALUES (?, ?, ?, ?)
            """;

  public static final String SQL_SELECT_GAME_RESULT_BY_GAME_ID =
    """
        SELECT *
        FROM game_results
        WHERE game_id = ?
        """;

  public static final String SQL_SELECT_TOP_GAME_RESULTS =
    """
        SELECT *
        FROM game_results
        ORDER BY score DESC
        LIMIT ?
        OFFSET ?
            """;
}
