import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from 'firebase/app';
import { ResourceLoader } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private firestore: AngularFirestore, 
    private authService: AuthService) { }

  addToCart(doc: any) {
    const db = firebase.firestore();
    var userRef = db.collection("carts").doc(this.authService.getUser());
    userRef.get()
      .then((querySnapshot) => {
        var docExists = querySnapshot.exists;
        if (docExists == true) {
          userRef.update({
            cart: firebase.firestore.FieldValue.arrayUnion(doc)
          })
        }
        else {
          userRef.set({
            cart: firebase.firestore.FieldValue.arrayUnion(doc)
          });
        }
      });
    alert("Added to Cart!");
  }

  addToOrder(doc: any) {
    const db = this.firestore;
    db.collection("mail").add({
      to: this.authService.getEmail(),
      message: {
        subject: `Order Confirmation for ${doc.listingTitle}`,
        text: `This is the order that you purchased \n `
      },
    })
    db.collection("mail").add({
      to: doc.email,
      message: {
        subject: `Order Purchased for ${doc.listingTitle}`,
        text: `This is your listing that was purchased \n `
      },
    })
    .then(() => console.log("Queued email for delivery!"))
    .catch((error) => {
      console.error(error);
    });
  }

  async removeFromCart(doc: any) {
    const db = firebase.firestore();
    var userRef = db.collection("carts").doc(this.authService.getUser());

    userRef.update({
      cart: firebase.firestore.FieldValue.arrayRemove(doc)
    });
    // alert("Deleted from Cart!");
    await this.delay(500);
    location.reload();
  }

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }
}
