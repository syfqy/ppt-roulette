import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LobbyService } from '../services/lobby.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css'],
})
export class JoinGameComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private lobbyService: LobbyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      playerName: this.fb.control('', Validators.required),
      gameId: this.fb.control('', Validators.required),
    });
  }

  submitForm(): void {
    const playerName = this.form.get('playerName')?.value;
    const gameId = this.form.get('gameId')?.value;

    // check game exists then join game lobby
    // TODO: handle cannot join lobby exceptions (e.g. lobby full, invalid game id)
    this.lobbyService
      .joinLobby(gameId)
      .then((res) => {
        console.log(`>>> gameId ${res.gameId} available to join`);
        // register player name
        this.playerService.setPlayerName(playerName);

        // go to game lobby
        this.router.navigate(['/lobby', res.gameId]);
      })
      .catch((err) => console.error(err));
  }
}
