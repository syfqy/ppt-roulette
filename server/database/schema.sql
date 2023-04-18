DROP SCHEMA IF EXISTS ppt_roulette;
CREATE SCHEMA ppt_roulette;

USE ppt_roulette;

DROP TABLE IF EXISTS scores;
CREATE TABLE scores (
    player_name VARCHAR(32) NOT NULL,
    game_id VARCHAR(8) NOT NULL,
    score INTEGER NOT NULL,

    PRIMARY KEY (player_name, game_id)
)

