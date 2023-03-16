import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateGameComponent } from './components/create-game.component';
import { GameAssistantViewComponent } from './components/game-assistant-view.component';
import { GameJudgeViewComponent } from './components/game-judge-view.component';
import { GameSpeakerViewComponent } from './components/game-speaker-view.component';
import { HomeComponent } from './components/home.component';
import { JoinGameComponent } from './components/join-game.component';
import { LobbyComponent } from './components/lobby.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/create', component: CreateGameComponent },
  { path: 'game/join', component: JoinGameComponent },
  { path: 'lobby/:gameId', component: LobbyComponent },
  { path: 'game/:gameId', component: GameSpeakerViewComponent },
  { path: 'game/:gameId/assistant', component: GameAssistantViewComponent },
  { path: 'game/:gameId/judge', component: GameJudgeViewComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
