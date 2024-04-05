import { Component } from '@angular/core';
import { Observable, Subject, Subscription, catchError, finalize, ignoreElements, interval, of, startWith, switchMap } from 'rxjs';
import { CryptoService } from './crypto-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'currancy';
  cryptos$!: Observable<any[]>;
  loading: boolean = false;
  intervalSubscription!: Subscription;
  refreshTime: number = 0;

  Error$: Subject<string> = new Subject<string>();

  constructor(private cryptoService: CryptoService) { }

 
  ngOnInit(): void {
    this.loading=true;
    this.cryptos$ = interval(10000).pipe(
      startWith(0),
      switchMap(() => {
        this.refreshTime = 0; 
        return this.cryptoService.getTopCryptos();
      }),
      catchError((error) => {
       this.Error$.next('Error fetching data. Please try again');
        return of([]);
      }),
      
      finalize(() => {
        this.loading = false;
      })
    );
    interval(1000).subscribe(() => {
      this.refreshTime++;
    });
  }

  
  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}
