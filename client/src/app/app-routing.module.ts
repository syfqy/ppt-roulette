import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateGameComponent } from './components/create-game.component';
import { HomeComponent } from './components/home.component';
import { JoinGameComponent } from './components/join-game.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/create', component: CreateGameComponent },
  { path: 'game/join', component: JoinGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
