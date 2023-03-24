package vttp.miniproject2.pptroulette.configs;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

  @Value("${AWS_ACCESS_KEY}")
  private String accessKey;

  @Value("${AWS_SECRET_KEY}")
  private String secretKey;

  @Value("${AWS_S3_ENDPOINT}")
  private String endpoint;

  @Bean
  public AmazonS3 createS3Client() {
    // Create a credential
    BasicAWSCredentials cred = new BasicAWSCredentials(accessKey, secretKey);

    return AmazonS3ClientBuilder
      .standard()
      .withRegion(Regions.AP_SOUTHEAST_1)
      .withCredentials(new AWSStaticCredentialsProvider(cred))
      .build();
  }
}
