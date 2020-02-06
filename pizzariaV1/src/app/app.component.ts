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
  // Insira os dados da sua conta do Firebase
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
firebase.initializeApp(firebaseConfig);
// Initialize Firebase

