import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  showBackgroundImage = true;
  routeSub$!: Subscription;
  alignTop: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.showBackgroundImage = true;
    // TODO: Remove
    console.log('>>> production env: ' + environment.production);
    console.log('>>> ws endpoint: ' + environment.wsEndpoint);

    // subscribe to route changes
    this.routeSub$ = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        console.log(e.url); // logs the current URL
        const url = e.url.toString().toLowerCase();
        this.showBackgroundImage =
          url.includes('create') || url.includes('join') || url === '/';
        this.alignTop = url.includes('high-scores') || url.includes('images');
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub$.unsubscribe();
  }
}
