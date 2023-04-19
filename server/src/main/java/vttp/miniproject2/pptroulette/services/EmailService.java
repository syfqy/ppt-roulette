package vttp.miniproject2.pptroulette.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import vttp.miniproject2.pptroulette.models.GameResult;

@Service
public class EmailService {

  @Autowired
  private JavaMailSender mailSender;

  public void sendGameResult(String email, GameResult gameResult) {
    // TODO: change message
    String body = gameResult.toString();

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("PPT Roulette game result");
    message.setText(body);
    message.setFrom("syafiq.ysf@gmail.com");

    mailSender.send(message);
    System.out.println(">>> Game result sent to: " + email);
  }
}
