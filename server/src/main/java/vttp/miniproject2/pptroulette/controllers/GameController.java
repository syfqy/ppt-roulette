package vttp.miniproject2.pptroulette.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import vttp.miniproject2.pptroulette.models.Lobby;
import vttp.miniproject2.pptroulette.models.LobbyUpdate;
import vttp.miniproject2.pptroulette.models.Player;
import vttp.miniproject2.pptroulette.services.GameService;
import vttp.miniproject2.pptroulette.services.LobbyService;

@Controller
public class GameController {

  @Autowired
  LobbyService lobbyService;

  @Autowired
  GameService gameService;

  @MessageMapping("/{gameId}")
  @SendTo("/topic/lobby/{gameId}")
  public Lobby sendLobbyUpdate(
    @DestinationVariable String gameId,
    LobbyUpdate lobbyUpdate
  ) {
    Player player = lobbyUpdate.getPlayer();
    String lobbyAction = lobbyUpdate.isJoining() ? "joining" : "leaving";

    Lobby lobby = lobbyUpdate.isJoining()
      ? lobbyService.addPlayer(player, gameId)
      : lobbyService.removePlayer(player, gameId);

    System.out.println(
      ">>> Player: %s %s game: %s".formatted(
          player.getName(),
          lobbyAction,
          gameId
        )
    );

    return lobby;
  }

  @MessageMapping("/start/{gameId}")
  @SendTo("/topic/start/{gameId}")
  public boolean sendGameStart(@DestinationVariable String gameId) {
    // check game created
    if (gameService.isGameCreated(gameId)) System.out.println(
      ">>> Host has started game: " + gameId
    );
    return gameService.isGameCreated(gameId);
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
