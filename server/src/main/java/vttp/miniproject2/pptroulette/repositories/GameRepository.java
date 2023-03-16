package vttp.miniproject2.pptroulette.repositories;

import java.util.LinkedList;
import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.stereotype.Repository;

@Repository
public class GameRepository {

  @Autowired
  private MongoTemplate mongoTemplate;

  private static final String TOPIC_COLLECTION = "topics";
  private static final String PROMPT_COLLECTION = "prompts";
  private static final String IMAGE_COLLECTION = "images";

  public String getRandomTopic() {
    SampleOperation sample = Aggregation.sample(1);
    Aggregation agg = Aggregation.newAggregation(sample);
    AggregationResults<Document> output = mongoTemplate.aggregate(
      agg,
      TOPIC_COLLECTION,
      Document.class
    );
    List<String> results = new LinkedList<>();
    output.forEach(doc -> results.add(doc.getString("topic")));
    return results.get(0);
  }

  public List<String> getRandomPrompts(Integer numPrompts) {
    SampleOperation sample = Aggregation.sample(numPrompts);
    Aggregation agg = Aggregation.newAggregation(sample);
    AggregationResults<Document> output = mongoTemplate.aggregate(
      agg,
      PROMPT_COLLECTION,
      Document.class
    );
    List<String> results = new LinkedList<>();
    output.forEach(doc -> results.add(doc.getString("prompt")));
    return results;
  }

  // TODO: return list of images instead of imageUrls
  public List<String> getRandomImages(Integer numImages) {
    SampleOperation sample = Aggregation.sample(numImages);
    Aggregation agg = Aggregation.newAggregation(sample);
    AggregationResults<Document> output = mongoTemplate.aggregate(
      agg,
      IMAGE_COLLECTION,
      Document.class
    );

    final String BASE_URL =
      "https://vttp-csf.s3.ap-southeast-1.amazonaws.com/ppt-roulette/";

    List<String> results = new LinkedList<>();
    output.forEach(doc -> results.add(BASE_URL + doc.getString("imageUrl")));
    return results;
  }
}
