package vttp.miniproject2.pptroulette.repositories;

public class Queries {

  public static final String SQL_INSERT_SCORE =
    """
        INSERT INTO scores (player_name, game_id, score)
        VALUES (?, ?, ?)
            """;
}
