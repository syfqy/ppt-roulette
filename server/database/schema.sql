DROP SCHEMA IF EXISTS ppt_roulette;
CREATE SCHEMA ppt_roulette;

USE ppt_roulette;

DROP TABLE IF EXISTS game_results;
CREATE TABLE game_results (
    game_id VARCHAR(8) NOT NULL,
    speaker_name VARCHAR(32) NOT NULL,
    assistant_name VARCHAR(32) NOT NULL,
    score INTEGER NOT NULL,

    PRIMARY KEY (game_id)
);