package vttp.miniproject2.pptroulette.models;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import java.util.List;
import lombok.Data;

@Data
public class Game {

  private String gameId;
  private Player speaker;
  private Player assistant;
  private List<Player> judges;
  private String topic;
  private List<String> prompts;
  private List<String> imageUrls;

  public JsonObject toJson() {
    JsonArrayBuilder judgesArr = Json.createArrayBuilder();
    JsonArrayBuilder promptsArr = Json.createArrayBuilder();
    JsonArrayBuilder imagesArr = Json.createArrayBuilder();

    judges.forEach(j -> judgesArr.add(j.toJson()));
    prompts.forEach(p -> promptsArr.add(p));
    imageUrls.forEach(i -> imagesArr.add(i));

    return Json
      .createObjectBuilder()
      .add("gameId", this.gameId)
      .add("speaker", this.speaker.toJson())
      .add("assistant", this.assistant.toJson())
      .add("judges", judgesArr)
      .add("topic", this.topic)
      .add("prompts", promptsArr)
      .add("imageUrls", imagesArr)
      .build();
  }
}
