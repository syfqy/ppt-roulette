import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddImageComponent } from './components/add-image.component';
import { CreateGameComponent } from './components/create-game.component';
import { GameAssistantViewComponent } from './components/game-assistant-view.component';
import { GameJudgeViewComponent } from './components/game-judge-view.component';
import { GameSpeakerViewComponent } from './components/game-speaker-view.component';
import { HomeComponent } from './components/home.component';
import { ImageListComponent } from './components/image-list.component';
import { JoinGameComponent } from './components/join-game.component';
import { LobbyComponent } from './components/lobby.component';
import { ManageImagesComponent } from './components/manage-images.component';
import { GameOverSpeakerViewComponent } from './components/game-over-speaker-view.component';
import { HighScoresComponent } from './components/high-scores.component';
import { GameOverAssistantViewComponent } from './components/game-over-assistant-view.component';
import { GameOverJudgeViewComponent } from './components/game-over-judge-view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'images',
    component: ManageImagesComponent,
    children: [
      {
        path: 'all',
        component: ImageListComponent,
      },
      {
        path: 'new',
        component: AddImageComponent,
      },
    ],
  },
  { path: 'high-scores', component: HighScoresComponent },
  { path: 'game/create', component: CreateGameComponent },
  { path: 'game/join', component: JoinGameComponent },
  { path: 'lobby/:gameId', component: LobbyComponent },
  { path: 'game/:gameId', component: GameSpeakerViewComponent },
  { path: 'game/:gameId/assistant', component: GameAssistantViewComponent },
  { path: 'game/:gameId/judge', component: GameJudgeViewComponent },
  {
    path: 'game-over/:gameId/speaker',
    component: GameOverSpeakerViewComponent,
  },
  {
    path: 'game-over/:gameId/assistant',
    component: GameOverAssistantViewComponent,
  },
  { path: 'game-over/:gameId/judge', component: GameOverJudgeViewComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
