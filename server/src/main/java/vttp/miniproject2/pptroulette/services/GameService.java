package vttp.miniproject2.pptroulette.services;

import com.google.common.collect.Lists;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.DeckMaterials;
import vttp.miniproject2.pptroulette.models.Game;
import vttp.miniproject2.pptroulette.models.Image;
import vttp.miniproject2.pptroulette.models.Lobby;
import vttp.miniproject2.pptroulette.models.Prompt;
import vttp.miniproject2.pptroulette.models.Topic;
import vttp.miniproject2.pptroulette.repositories.DeckRepository;
import vttp.miniproject2.pptroulette.repositories.GameCache;

@Service
public class GameService {

  @Autowired
  private LobbyService lobbyService;

  @Autowired
  private DeckRepository deckRepo;

  @Autowired
  private GameCache gameCache;

  public Optional<Game> createGame(String gameId) {
    Lobby lobby = lobbyService.getLobby(gameId);
    if (!lobby.isCanStartGame()) {
      return Optional.empty();
    }

    // create new game from lobby
    System.out.println(">>> Creating new game for lobby: %s".formatted(gameId));
    Game game = new Game(lobby);

    // create deck
    Topic topic = deckRepo.getRandomTopic();
    List<Prompt> prompts = deckRepo.getRandomPrompts(2);
    List<Image> images = deckRepo.getRandomImages(9);
    List<List<Image>> imageLists = Lists.partition(images, 3);

    DeckMaterials deckMaterials = new DeckMaterials();
    deckMaterials.setTopic(topic);
    deckMaterials.setPrompts(prompts);
    deckMaterials.setImageLists(imageLists);

    game.setDeckMaterials(deckMaterials);
    gameCache.startGame(gameId);

    return Optional.of(game);
  }

  public boolean isGameCreated(String gameId) {
    return gameCache.isGameCreated(gameId);
  }
}
