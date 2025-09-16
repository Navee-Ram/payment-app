import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems: CartItem[] = [
    { id: 1, name: 'Product A', price: 30, quantity: 1 },
    { id: 2, name: 'Product B', price: 50, quantity: 1 },
    { id: 3, name: 'Product C', price: 70, quantity: 1 }
  ];

  constructor(private router: Router) {}

  get subtotal() {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(item: CartItem, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    item.quantity = Math.max(1, Number(value));
  }

  checkout() {
    this.router.navigate(['/payment']);
  }
}
