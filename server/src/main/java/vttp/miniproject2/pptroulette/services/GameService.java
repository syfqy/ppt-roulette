package vttp.miniproject2.pptroulette.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.Game;
import vttp.miniproject2.pptroulette.models.Lobby;
import vttp.miniproject2.pptroulette.models.Player;
import vttp.miniproject2.pptroulette.repositories.GameCache;
import vttp.miniproject2.pptroulette.repositories.GameRepository;

@Service
public class GameService {

  @Autowired
  private GameCache gameCache;

  @Autowired
  private GameRepository gameRepo;

  public Game createGame(Lobby lobby) {
    // TODO: validate lobby

    // create new game
    System.out.println(">>> Intializing game");
    Game game = new Game();
    List<Player> players = lobby.getPlayers();

    // set roles
    // SMELL: duplication
    Player speaker = players
      .stream()
      .filter(p -> p.getRole().toLowerCase().equals("speaker"))
      .findFirst()
      .get();

    Player assistant = players
      .stream()
      .filter(p -> p.getRole().toLowerCase().equals("assistant"))
      .findFirst()
      .get();

    List<Player> judges = players
      .stream()
      .filter(p -> p.getRole().toLowerCase().equals("judge"))
      .toList();

    String topic = gameRepo.getRandomTopic();
    List<String> prompts = gameRepo.getRandomPrompts(2);
    List<String> images = gameRepo.getRandomImages(3);

    game.setGameId(lobby.getGameId());
    game.setSpeaker(speaker);
    game.setAssistant(assistant);
    game.setJudges(judges);
    game.setTopic(topic);
    game.setPrompts(prompts);
    game.setImageUrls(images);

    // TODO: cache game
    // gameCache.saveGameState(game);

    return game;
  }
}
