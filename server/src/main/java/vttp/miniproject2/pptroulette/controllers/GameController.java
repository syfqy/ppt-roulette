package vttp.miniproject2.pptroulette.controllers;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import vttp.miniproject2.pptroulette.models.Lobby;
import vttp.miniproject2.pptroulette.models.Player;
import vttp.miniproject2.pptroulette.services.GameService;

@Controller
public class GameController {

  @Autowired
  GameService gameService;

  @MessageMapping("/join/{gameId}")
  @SendTo("/topic/join/{gameId}")
  public List<Player> sendPlayerJoined(
    @DestinationVariable String gameId,
    Player player
  ) {
    System.out.println(
      ">>> Player: %s joining game: %s".formatted(player.getName(), gameId)
    );

    List<Player> players = gameService.addPlayer(player, gameId);
    Lobby lobby = new Lobby();
    lobby.setGameId(gameId);
    lobby.setPlayers(players);
    // SMELL: should cache hostname
    lobby.setHostName(
      players.stream().filter(p -> p.isHost()).findFirst().get().getName()
    );

    // set roles
    if (players.size() >= Lobby.MIN_NUM_PLAYERS) {
      lobby.setRoles();
    }

    players.forEach(p -> System.out.println(p.toString()));
    System.out.println(">>> Number of players in lobby: " + players.size());

    return players;
  }

  @MessageMapping("/start/{gameId}")
  @SendTo("/topic/start/{gameId}")
  public boolean sendGameStart(@DestinationVariable String gameId) {
    return true;
  }

  @MessageMapping("/slide/{gameId}")
  @SendTo("/topic/slide/{gameId}")
  public Integer sendNextSlide(
    @DestinationVariable String gameId,
    Integer slideIdx
  ) {
    return slideIdx;
  }

  @MessageMapping("/nextImage/{gameId}")
  @SendTo("/topic/image/{gameId}")
  public String sendNextImage(
    @DestinationVariable String gameId,
    String imageUrl
  ) {
    return imageUrl;
  }

  @MessageMapping("/reactions/{gameId}")
  @SendTo("/topic/reactions/{gameId}")
  public String sendReaction(
    @DestinationVariable String gameId,
    String message
  ) {
    System.out.println(">>> message: " + message);
    return message;
  }
}
