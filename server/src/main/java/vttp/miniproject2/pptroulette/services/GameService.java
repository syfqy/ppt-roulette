package vttp.miniproject2.pptroulette.services;

import com.google.common.collect.Lists;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.Deck;
import vttp.miniproject2.pptroulette.models.Game;
import vttp.miniproject2.pptroulette.models.Image;
import vttp.miniproject2.pptroulette.models.Lobby;
import vttp.miniproject2.pptroulette.models.Prompt;
import vttp.miniproject2.pptroulette.models.Topic;
import vttp.miniproject2.pptroulette.repositories.DeckRepository;

@Service
public class GameService {

  @Autowired
  private LobbyService lobbyService;

  @Autowired
  private DeckRepository deckRepo;

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
    System.out.println(">>> Topic: " + topic);
    List<Prompt> prompts = deckRepo.getRandomPrompts(2);
    prompts.forEach(p -> System.out.println(p));
    List<Image> images = deckRepo.getRandomImages(9);
    images.forEach(p -> System.out.println(p));
    List<List<Image>> imageLists = Lists.partition(images, 10);

    Deck deck = new Deck();
    deck.setTopic(topic);
    deck.setPrompts(prompts);
    deck.setImageLists(imageLists);

    game.setDeck(deck);

    return Optional.of(game);
  }
}
