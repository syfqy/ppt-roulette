package vttp.miniproject2.pptroulette.services;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import java.io.StringReader;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class PexelsAPIService {

  @Value("${PEXELS_API_KEY}")
  private String API_KEY;

  @Value("${PEXELS_BASE_URL}")
  private String BASE_URL;

  public List<String> searchImages(String query, Integer limit) {
    final String url = UriComponentsBuilder
      .fromUriString(BASE_URL)
      .queryParam("query", query)
      .queryParam("per_page", limit)
      .toUriString();

    RequestEntity req = RequestEntity
      .get(url)
      .header("Authorization", API_KEY)
      .accept(MediaType.APPLICATION_JSON)
      .build();

    RestTemplate template = new RestTemplate();
    ResponseEntity<String> resp = template.exchange(req, String.class);

    JsonReader reader = Json.createReader(new StringReader(resp.getBody()));
    JsonObject json = reader.readObject();

    JsonArray results = json.getJsonArray("photos");

    List<String> imageUrls = results
      .stream()
      .map(r -> r.asJsonObject())
      .map(j -> j.getJsonObject("src"))
      .map(s -> s.getString("original"))
      .toList();

    return imageUrls;
  }
}
