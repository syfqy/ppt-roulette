import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Player } from '../models/player.model';
import { LobbyService } from '../services/lobby.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css'],
})
export class CreateGameComponent implements OnInit {
  form!: FormGroup;
  host!: Player;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private lobbyService: LobbyService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      hostName: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  submitForm(): void {
    const hostName = this.form.get('hostName')?.value;

    this.host = new Player(hostName, '', true);

    // request new lobby from server
    this.lobbyService
      .createLobby(this.host)
      .then((res) => {
        const gameId = res.gameId;
        console.log('>>> Game created: ' + gameId);

        // register player in player service
        this.playerService.setPlayer(this.host);

        // go to game lobby
        this.router.navigate(['lobby', gameId]);
      })
      .catch((err) => console.error(err));
  }
}
