package vttp.miniproject2.pptroulette.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vttp.miniproject2.pptroulette.models.Game;
import vttp.miniproject2.pptroulette.models.Lobby;
import vttp.miniproject2.pptroulette.repositories.GameRepository;
import vttp.miniproject2.pptroulette.services.GameService;

@RestController
@RequestMapping(path = "/api/game", produces = MediaType.APPLICATION_JSON_VALUE)
public class GameRESTController {

  @Autowired
  private GameService gameService;

  @Autowired
  private GameRepository gameRepo;

  @PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<String> createLobby(@RequestBody String body) {
    // get host name
    JsonReader reader = Json.createReader(new StringReader(body));
    JsonObject json = reader.readObject();
    String hostName = json.getString("hostName");

    System.out.println(">>> Creating new lobby for host: " + hostName);

    // create new room
    String gameId = gameService.createGame(hostName);

    JsonObject resp = Json.createObjectBuilder().add("gameId", gameId).build();

    System.out.println(">>> Created new lobby: " + gameId);

    return ResponseEntity.ok(resp.toString());
  }

  @GetMapping(path = "/join/{gameId}")
  public ResponseEntity<String> joinLobby(@PathVariable String gameId) {
    // get gameId
    if (!gameService.isGameOngoing(gameId)) {
      System.out.println(">>> gameId: %s not found".formatted(gameId));
      JsonObject resp = Json
        .createObjectBuilder()
        .add("error", "gameId %s not found".formatted(gameId))
        .build();
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp.toString());
    }
    System.out.println(">>> gameId: %s available to join".formatted(gameId));
    JsonObject resp = Json.createObjectBuilder().add("gameId", gameId).build();
    return ResponseEntity.ok(resp.toString());
  }

  @PostMapping(path = "/start/{gameId}")
  public ResponseEntity<String> startGame(
    @PathVariable String gameId,
    @RequestBody Lobby lobby
  ) {
    // start game
    Game game = gameService.startGame(lobby);
    System.out.println(">>> Starting game");

    ObjectMapper mapper = new ObjectMapper();
    String resp;
    try {
      resp = mapper.writeValueAsString(game);
      return ResponseEntity.ok(resp);
    } catch (JsonProcessingException e) {
      System.out.println(">>> Cannnot map game to JSON");
      e.printStackTrace();
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("error");
    }
  }

  @GetMapping(path = "/images")
  public ResponseEntity<String> getImages() {
    // TODO: get images from service
    List<String> images = gameRepo.getRandomImages(9);
    ObjectMapper mapper = new ObjectMapper();
    try {
      return ResponseEntity.ok(mapper.writeValueAsString(images));
    } catch (JsonProcessingException e) {
      e.printStackTrace();
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("error");
    }
  }
}
