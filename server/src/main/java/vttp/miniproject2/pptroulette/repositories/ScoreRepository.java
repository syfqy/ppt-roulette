package vttp.miniproject2.pptroulette.repositories;

import static vttp.miniproject2.pptroulette.repositories.Queries.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ScoreRepository {

  @Autowired
  private JdbcTemplate jdbcTemplate;

  public boolean insertScore(String player_name, Integer score) {
    return jdbcTemplate.update(SQL_INSERT_SCORE, player_name, score) > 1;
  }
}
