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
    String body
  ) {
    // register new player
    JsonReader reader = Json.createReader(new StringReader(body));
    JsonObject json = reader.readObject();
    Player player = Player.fromJson(json);

    System.out.println(
      ">>> Player: %s joining game: %s".formatted(player.getName(), gameId)
    );

    List<Player> players = gameService.addPlayer(player, gameId);

    // TODO: move setting roles to Lobby
    if (players.size() >= 3) {
      players.get(0).setRole("Speaker");
      players.get(1).setRole("Assistant");
      for (int i = 2; i < players.size(); i++) {
        players.get(i).setRole("Judge");
      }
    }

    players.forEach(p -> System.out.println(p.toString()));
    System.out.println(">>> Number of players in lobby: " + players.size());

    return players;
  }
}
