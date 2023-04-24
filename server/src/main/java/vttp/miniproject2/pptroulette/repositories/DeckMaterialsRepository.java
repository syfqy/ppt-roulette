package vttp.miniproject2.pptroulette.repositories;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.data.mongodb.core.query.Criteria;
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
  private static final String GAME_IMAGE_COLLECTION = "game_images";
  private static final String USER_IMAGE_COLLECTION = "user_images";

  public List<Image> getImagesByUser(String username) {
    Query q = new Query(Criteria.where("username").is(username));
    return mongoTemplate.find(q, Image.class, USER_IMAGE_COLLECTION);
  }

  public Integer getImageCountByUser(String username) {
    Query q = new Query(Criteria.where("username").is(username));
    return (int) mongoTemplate.count(q, USER_IMAGE_COLLECTION);
  }

  public Topic getRandomTopic() {
    List<Topic> results = getNRandomItems(1, Topic.class, TOPIC_COLLECTION);
    return results.get(0);
  }

  public List<Prompt> getRandomPrompts(Integer numPrompts) {
    return getNRandomItems(numPrompts, Prompt.class, PROMPT_COLLECTION);
  }

  public List<Image> getRandomGameImages(Integer numImages) {
    return getNRandomItems(numImages, Image.class, GAME_IMAGE_COLLECTION);
  }

  public List<Image> getRandomUserImages(Integer numImages) {
    return getNRandomItems(numImages, Image.class, USER_IMAGE_COLLECTION);
  }

  public Image insertImage(Image image) {
    return mongoTemplate.insert(image, USER_IMAGE_COLLECTION);
  }

  public boolean deleteImage(String imageId) {
    Query q = Query.query(Criteria.where("imageId").is(imageId));
    return mongoTemplate.remove(q, USER_IMAGE_COLLECTION).getDeletedCount() > 0;
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
