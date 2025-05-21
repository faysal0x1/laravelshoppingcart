# Laravel Shopping Cart

A powerful and flexible shopping cart implementation for Laravel 7, 8, 9, 10, and 11. This package provides a simple and elegant way to manage shopping carts in your Laravel applications, supporting multiple cart instances, tax calculations, and various integration methods.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Integration Methods](#integration-methods)
  - [Blade Templates](#blade-templates)
  - [Inertia.js](#inertiajs)
  - [API Integration](#api-integration)
- [Advanced Features](#advanced-features)
- [Events](#events)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the package through [Composer](http://getcomposer.org/):

```bash
composer require faysal0x1/laravelshoppingcart
```

### Laravel <= 7.0

For Laravel 7.0, add the service provider and alias in `config/app.php`:

```php
'providers' => [
    // ...
    Gloudemans\Shoppingcart\ShoppingcartServiceProvider::class,
],

'aliases' => [
    // ...
    'Cart' => Gloudemans\Shoppingcart\Facades\Cart::class,
],
```

## Configuration

Publish the configuration file:

```bash
php artisan vendor:publish --provider="Gloudemans\Shoppingcart\ShoppingcartServiceProvider"
```

This will create a `config/cart.php` file where you can customize:
- Tax rate
- Number format
- Default cart instance
- Database storage settings

## Basic Usage

### Adding Items

```php
// Basic usage
Cart::add('293ad', 'Product 1', 1, 9.99);

// With options
Cart::add('293ad', 'Product 1', 1, 9.99, ['size' => 'large']);

// Using array
Cart::add([
    'id' => '293ad',
    'name' => 'Product 1',
    'qty' => 1,
    'price' => 9.99,
    'options' => ['size' => 'large']
]);

// Using Buyable interface
Cart::add($product, 1, ['size' => 'large']);
```

### Updating Items

```php
$rowId = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

// Update quantity
Cart::update($rowId, 2);

// Update item details
Cart::update($rowId, ['name' => 'New Product Name']);

// Update with Buyable
Cart::update($rowId, $product);
```

### Removing Items

```php
Cart::remove($rowId);
```

### Getting Cart Content

```php
// Get all items
$items = Cart::content();

// Get specific item
$item = Cart::get($rowId);

// Get cart total
$total = Cart::total();

// Get tax amount
$tax = Cart::tax();

// Get subtotal
$subtotal = Cart::subtotal();

// Get item count
$count = Cart::count();
```

## Integration Methods

### Blade Templates

```php
// In your controller
public function index()
{
    $cart = Cart::content();
    return view('cart.index', compact('cart'));
}
```

```blade
{{-- In your blade view --}}
@foreach(Cart::content() as $item)
    <div class="cart-item">
        <h3>{{ $item->name }}</h3>
        <p>Quantity: {{ $item->qty }}</p>
        <p>Price: {{ $item->price }}</p>
        @if($item->options->has('size'))
            <p>Size: {{ $item->options->size }}</p>
        @endif
    </div>
@endforeach

<div class="cart-total">
    <p>Subtotal: {{ Cart::subtotal() }}</p>
    <p>Tax: {{ Cart::tax() }}</p>
    <p>Total: {{ Cart::total() }}</p>
</div>
```

### Inertia.js

```php
// In your controller
public function index()
{
    return Inertia::render('Cart/Index', [
        'cart' => [
            'items' => Cart::content(),
            'subtotal' => Cart::subtotal(),
            'tax' => Cart::tax(),
            'total' => Cart::total(),
        ]
    ]);
}
```

```vue
<!-- In your Vue component -->
<template>
  <div>
    <div v-for="item in cart.items" :key="item.rowId" class="cart-item">
      <h3>{{ item.name }}</h3>
      <p>Quantity: {{ item.qty }}</p>
      <p>Price: {{ item.price }}</p>
      <p v-if="item.options.size">Size: {{ item.options.size }}</p>
    </div>
    
    <div class="cart-total">
      <p>Subtotal: {{ cart.subtotal }}</p>
      <p>Tax: {{ cart.tax }}</p>
      <p>Total: {{ cart.total }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cart: Object
  }
}
</script>
```

### API Integration

```php
// In your API controller
public function addToCart(Request $request)
{
    $validated = $request->validate([
        'id' => 'required',
        'name' => 'required',
        'qty' => 'required|numeric|min:1',
        'price' => 'required|numeric|min:0',
        'options' => 'array'
    ]);

    Cart::add($validated);

    return response()->json([
        'message' => 'Item added to cart',
        'cart' => [
            'items' => Cart::content(),
            'total' => Cart::total()
        ]
    ]);
}

public function getCart()
{
    return response()->json([
        'items' => Cart::content(),
        'subtotal' => Cart::subtotal(),
        'tax' => Cart::tax(),
        'total' => Cart::total()
    ]);
}
```

## Advanced Features

### Multiple Cart Instances

```php
// Create a wishlist instance
Cart::instance('wishlist')->add('293ad', 'Product 1', 1, 9.99);

// Get wishlist content
$wishlist = Cart::instance('wishlist')->content();
```

### Database Storage

Enable database storage in `config/cart.php`:

```php
'storage' => 'database',
```

Run migrations:

```bash
php artisan migrate
```

### Events

The package fires several events you can listen to:

```php
// In your EventServiceProvider
protected $listen = [
    'cart.added' => [
        'App\Listeners\CartItemAdded',
    ],
    'cart.updated' => [
        'App\Listeners\CartItemUpdated',
    ],
    'cart.removed' => [
        'App\Listeners\CartItemRemoved',
    ],
];
```

## Testing

Run the test suite:

```bash
composer test
```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
