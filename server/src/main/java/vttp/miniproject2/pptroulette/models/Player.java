package vttp.miniproject2.pptroulette.models;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import lombok.Data;

@Data
public class Player {

  // TODO: set roles as enums
  private String name;
  private String role;
  private boolean host;
  // public JsonObject toJson() {
  //   return Json
  //     .createObjectBuilder()
  //     .add("name", name)
  //     .add("role", role)
  //     .add("host", host)
  //     .build();
  // }

  // public static Player fromJson(JsonObject json) {
  //   Player player = new Player();
  //   player.setName(json.getString("name"));
  //   player.setRole(json.getString("role"));
  //   player.setHost(json.getBoolean("host"));
  //   return player;
  // }
}
