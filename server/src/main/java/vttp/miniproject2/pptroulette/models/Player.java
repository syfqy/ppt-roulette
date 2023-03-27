package vttp.miniproject2.pptroulette.models;

import lombok.Data;

@Data
public class Player {

  // TODO: set roles as enums
  private String name;
  private String role;
  private boolean host;
}
