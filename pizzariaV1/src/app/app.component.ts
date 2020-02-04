import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pizzariaV1';

  public idTokenDivinaProvidencia: any
  public carregamentoPagina: boolean
  constructor(private router: Router) {

    this.idTokenDivinaProvidencia = localStorage.getItem('idTokenDivinaProvidencia')

  }

  ngOnInit() {
    this.router.events.subscribe((url: any) => {
      if (url.url === '/' || url.url === '' && this.idTokenDivinaProvidencia !== null) {
        this.router.navigateByUrl('/home')
      }
    })
  }

  public login(event) {
    if (event === 'logado') {
      this.idTokenDivinaProvidencia = localStorage.getItem('idTokenDivinaProvidencia')
      this.router.navigateByUrl('/home')
    }
  }

  public logout(event) {
    if (event === 'logout') {
      this.idTokenDivinaProvidencia = null
    }
  }
}
var firebaseConfig = {
  apiKey: "AIzaSyBTumzBd0B1EJlQbqU_tktDwIBlS_WfGxU",
  authDomain: "divinaprovidencia-dev.firebaseapp.com",
  databaseURL: "https://divinaprovidencia-dev.firebaseio.com",
  projectId: "divinaprovidencia-dev",
  storageBucket: "divinaprovidencia-dev.appspot.com",
  messagingSenderId: "619814247873",
  appId: "1:619814247873:web:8fd3c1c2738f5f6cf9a340"
};
firebase.initializeApp(firebaseConfig);
// Initialize Firebase

