package vttp.miniproject2.pptroulette.controllers;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vttp.miniproject2.pptroulette.services.GameService;

@RestController
@RequestMapping(path = "/api/game", produces = MediaType.APPLICATION_JSON_VALUE)
public class GameRESTController {

  @Autowired
  private GameService gameService;

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
}
