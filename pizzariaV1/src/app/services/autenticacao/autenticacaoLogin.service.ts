import * as firebase from 'firebase'
import { Router } from '@angular/router'

export class AutenticacaoLogin {
    public idTokenDivinaProvidencia: string

    constructor(private router: Router) { }

    public autenticarLoginEmailSenha(email: string, senha: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, senha)
                .then(() => {
                    firebase.auth().currentUser.getIdToken()
                        .then((token) => {
                            this.idTokenDivinaProvidencia = token
                            localStorage.setItem('idTokenDivinaProvidencia', this.idTokenDivinaProvidencia)
                            resolve(this.idTokenDivinaProvidencia)
                        })
                    localStorage.setItem('nomeUsuario', firebase.auth().currentUser.email)
                })
                .catch((erro) => {
                    reject(erro)
                })

        })
    }


    public logout() {
        firebase.auth().signOut()
            .then(() => {
                this.idTokenDivinaProvidencia = undefined
                localStorage.removeItem('idTokenDivinaProvidencia')
                localStorage.removeItem('nomeUsuario')
            })
            .catch((erro: any) => console.log(erro))
    }

    public autenticado(): boolean {
        if (this.idTokenDivinaProvidencia === undefined && localStorage.getItem('idTokenDivinaProvidencia') === null) {
            return false
        } else {
            return true
        }
    }

    public autenticarComGoogle(): Promise<any> {
        return new Promise((resolve, reject) => {
            var provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    firebase.auth().signInWithPopup(provider)
                        .then((result) => {
                            let credenciais = []
                            credenciais.push(result.credential)
                            credenciais.forEach(token => {
                                this.idTokenDivinaProvidencia = token.idToken
                            });

                            localStorage.setItem('idTokenDivinaProvidencia', this.idTokenDivinaProvidencia)
                            resolve(this.idTokenDivinaProvidencia)
                        })
                        .catch((erro) => {
                            console.log(erro)
                            reject(erro)
                        })
                })
        })
    }

}