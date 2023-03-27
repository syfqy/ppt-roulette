package vttp.miniproject2.pptroulette.repositories;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import vttp.miniproject2.pptroulette.models.Image;
import vttp.miniproject2.pptroulette.models.Prompt;
import vttp.miniproject2.pptroulette.models.Topic;

@Repository
public class DeckMaterialsRepository {

  @Autowired
  private MongoTemplate mongoTemplate;

  private static final String TOPIC_COLLECTION = "topics";
  private static final String PROMPT_COLLECTION = "prompts";
  private static final String IMAGE_COLLECTION = "images";

  public Topic getRandomTopic() {
    List<Topic> results = getNRandomItems(1, Topic.class, TOPIC_COLLECTION);
    return results.get(0);
  }

  public List<Prompt> getRandomPrompts(Integer numPrompts) {
    return getNRandomItems(numPrompts, Prompt.class, PROMPT_COLLECTION);
  }

  public List<Image> getRandomImages(Integer numImages) {
    return getNRandomItems(numImages, Image.class, IMAGE_COLLECTION);
  }

  public List<Image> getImagesByUser(String userId) {
    // TODO: query by user, add user property to document
    return mongoTemplate.find(new Query(), Image.class, IMAGE_COLLECTION);
  }

  private <T> List<T> getNRandomItems(
    Integer numItems,
    Class<T> clazz,
    String collectionName
  ) {
    SampleOperation sample = Aggregation.sample(numItems);
    Aggregation agg = Aggregation.newAggregation(sample);
    AggregationResults<T> output = mongoTemplate.aggregate(
      agg,
      collectionName,
      clazz
    );
    List<T> results = output.getMappedResults();
    return results;
  }
}
