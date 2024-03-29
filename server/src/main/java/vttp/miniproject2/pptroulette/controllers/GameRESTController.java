package vttp.miniproject2.pptroulette.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vttp.miniproject2.pptroulette.models.Game;
import vttp.miniproject2.pptroulette.models.GameResult;
import vttp.miniproject2.pptroulette.models.Player;
import vttp.miniproject2.pptroulette.services.GameService;
import vttp.miniproject2.pptroulette.services.LobbyService;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class GameRESTController {

  @Autowired
  private LobbyService lobbyService;

  @Autowired
  private GameService gameService;

  @PostMapping(
    path = "/lobby/create",
    consumes = MediaType.APPLICATION_JSON_VALUE
  )
  public ResponseEntity<String> createLobby(@RequestBody Player host) {
    System.out.println(">>> Creating new lobby for host: " + host.getName());

    // create new lobby
    String gameId = lobbyService.createLobby(host);

    JsonObject resp = Json.createObjectBuilder().add("gameId", gameId).build();

    System.out.println(">>> Created new lobby: " + gameId);

    return ResponseEntity.status(HttpStatus.CREATED).body(resp.toString());
  }

  // FIXME: Change to POST mapping, require player in req body to validate join
  @GetMapping(path = "/lobby/join/{gameId}")
  public ResponseEntity<String> joinLobby(@PathVariable String gameId) {
    // validate joining

    // get gameId
    if (!lobbyService.isLobbyOpen(gameId)) {
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

  @GetMapping(path = "/game/create/{gameId}")
  public ResponseEntity<String> createGame(@PathVariable String gameId) {
    // start game
    Optional<Game> opt = gameService.createGame(gameId);
    if (opt.isEmpty()) return ResponseEntity
      .status(HttpStatus.BAD_REQUEST)
      .body("Lobby not ready to start game");

    System.out.println(">>> Starting game");
    ObjectMapper mapper = new ObjectMapper();
    String resp;
    try {
      resp = mapper.writeValueAsString(opt.get());
      return ResponseEntity.ok(resp);
    } catch (JsonProcessingException e) {
      System.out.println(">>> Cannnot map game to JSON");
      e.printStackTrace();
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("error");
    }
  }

  @PostMapping(path = "game/save/{gameId}")
  public ResponseEntity<String> saveGameResult(
    @PathVariable String gameId,
    @RequestBody GameResult gameResult
  ) {
    // save game result
    System.out.println(">>> Saving game result");
    gameService.insertGameResult(gameResult);
    JsonObject resp = Json.createObjectBuilder().add("gameId", gameId).build();
    return ResponseEntity.status(HttpStatus.CREATED).body(resp.toString());
  }

  @PostMapping(path = "game/email/{gameId}")
  public ResponseEntity<String> emailGameResult(
    @PathVariable String gameId,
    @RequestBody String body
  ) {
    JsonReader reader = Json.createReader(new StringReader(body));
    JsonObject json = reader.readObject();
    String email = json.getString("email");
    System.out.println(">>> Sending game result to : " + email);

    gameService.emailGameResult(gameId, email);
    // TODO: return non-null response
    return ResponseEntity.ok().body(null);
  }

  @GetMapping(path = "scores")
  public ResponseEntity<List<GameResult>> getHighScores(
    @RequestParam Integer limit,
    @RequestParam Integer offset
  ) {
    List<GameResult> highScores = gameService.getHighScores(limit, offset);

    return ResponseEntity.ok().body(highScores);
  }
}
