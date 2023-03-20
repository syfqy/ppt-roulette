import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home.component';
import { CreateGameComponent } from './components/create-game.component';
import { JoinGameComponent } from './components/join-game.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LobbyComponent } from './components/lobby.component';
import { HttpClientModule } from '@angular/common/http';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
import { RxStompService } from './services/rx-stomp.service';
import { GameSpeakerViewComponent } from './components/game-speaker-view.component';
import { GameAssistantViewComponent } from './components/game-assistant-view.component';
import { GameJudgeViewComponent } from './components/game-judge-view.component';
import { GameSlideComponent } from './components/game-slide.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateGameComponent,
    JoinGameComponent,
    LobbyComponent,
    GameSpeakerViewComponent,
    GameAssistantViewComponent,
    GameJudgeViewComponent,
    GameSlideComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
