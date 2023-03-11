package vttp.miniproject2.pptroulette.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

  @Value("${REDISHOST}")
  private String redisHost;

  @Value("${REDISPORT}")
  private Integer redisPort;

  @Value("${REDISUSER}")
  private String redisUsername;

  @Value("${REDISPASSWORD}")
  private String redisPassword;

  @Bean("GAME_CACHE")
  @Scope("singleton")
  public RedisTemplate<String, String> createRedisTemplate() {
    final RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();

    config.setHostName(redisHost);
    config.setPort(redisPort);
    config.setUsername(redisUsername);
    config.setPassword(redisPassword);

    final JedisClientConfiguration jedisClient = JedisClientConfiguration
      .builder()
      .build();

    final JedisConnectionFactory jedisFac = new JedisConnectionFactory(
      config,
      jedisClient
    );

    jedisFac.afterPropertiesSet();
    final RedisTemplate<String, String> template = new RedisTemplate<>();
    template.setConnectionFactory(jedisFac);
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new StringRedisSerializer());

    return template;
  }
}
