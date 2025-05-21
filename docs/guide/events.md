# Events

This guide shows you how to work with cart events in your application.

## Available Events

The package provides several events that you can listen to:

- `cart.added` - Fired when an item is added to the cart
- `cart.updated` - Fired when an item is updated in the cart
- `cart.removed` - Fired when an item is removed from the cart
- `cart.cleared` - Fired when the cart is cleared
- `cart.stored` - Fired when the cart is stored
- `cart.restored` - Fired when the cart is restored
- `cart.erased` - Fired when the cart is erased from storage

## Basic Usage

### Listening to Events

```php
// app/Providers/EventServiceProvider.php
use Illuminate\Support\Facades\Event;
use Gloudemans\Shoppingcart\Events\CartAdded;
use Gloudemans\Shoppingcart\Events\CartUpdated;
use Gloudemans\Shoppingcart\Events\CartRemoved;

public function boot()
{
    Event::listen('cart.added', function ($cart, $item) {
        // Handle item added
    });

    Event::listen('cart.updated', function ($cart, $item) {
        // Handle item updated
    });

    Event::listen('cart.removed', function ($cart, $item) {
        // Handle item removed
    });
}
```

### Event Classes

You can also use event classes:

```php
// app/Listeners/CartEventListener.php
namespace App\Listeners;

use Gloudemans\Shoppingcart\Events\CartAdded;
use Gloudemans\Shoppingcart\Events\CartUpdated;
use Gloudemans\Shoppingcart\Events\CartRemoved;

class CartEventListener
{
    public function handleCartAdded(CartAdded $event)
    {
        $cart = $event->cart;
        $item = $event->item;
        
        // Handle item added
    }

    public function handleCartUpdated(CartUpdated $event)
    {
        $cart = $event->cart;
        $item = $event->item;
        
        // Handle item updated
    }

    public function handleCartRemoved(CartRemoved $event)
    {
        $cart = $event->cart;
        $item = $event->item;
        
        // Handle item removed
    }
}
```

Register the listener:

```php
// app/Providers/EventServiceProvider.php
protected $listen = [
    'cart.added' => [
        'App\Listeners\CartEventListener@handleCartAdded',
    ],
    'cart.updated' => [
        'App\Listeners\CartEventListener@handleCartUpdated',
    ],
    'cart.removed' => [
        'App\Listeners\CartEventListener@handleCartRemoved',
    ],
];
```

## Use Cases

### Inventory Management

```php
// app/Listeners/InventoryListener.php
namespace App\Listeners;

use Gloudemans\Shoppingcart\Events\CartAdded;
use Gloudemans\Shoppingcart\Events\CartRemoved;
use App\Models\Product;

class InventoryListener
{
    public function handleCartAdded(CartAdded $event)
    {
        $item = $event->item;
        $product = Product::find($item->id);
        
        // Update inventory
        $product->decrement('stock', $item->qty);
    }

    public function handleCartRemoved(CartRemoved $event)
    {
        $item = $event->item;
        $product = Product::find($item->id);
        
        // Restore inventory
        $product->increment('stock', $item->qty);
    }
}
```

### Price History

```php
// app/Listeners/PriceHistoryListener.php
namespace App\Listeners;

use Gloudemans\Shoppingcart\Events\CartAdded;
use App\Models\PriceHistory;

class PriceHistoryListener
{
    public function handleCartAdded(CartAdded $event)
    {
        $item = $event->item;
        
        // Record price history
        PriceHistory::create([
            'product_id' => $item->id,
            'price' => $item->price,
            'quantity' => $item->qty,
            'total' => $item->total
        ]);
    }
}
```

### Cart Analytics

```php
// app/Listeners/CartAnalyticsListener.php
namespace App\Listeners;

use Gloudemans\Shoppingcart\Events\CartAdded;
use Gloudemans\Shoppingcart\Events\CartRemoved;
use App\Models\CartAnalytics;

class CartAnalyticsListener
{
    public function handleCartAdded(CartAdded $event)
    {
        $item = $event->item;
        
        // Record cart addition
        CartAnalytics::create([
            'action' => 'added',
            'product_id' => $item->id,
            'quantity' => $item->qty,
            'price' => $item->price
        ]);
    }

    public function handleCartRemoved(CartRemoved $event)
    {
        $item = $event->item;
        
        // Record cart removal
        CartAnalytics::create([
            'action' => 'removed',
            'product_id' => $item->id,
            'quantity' => $item->qty,
            'price' => $item->price
        ]);
    }
}
```

## Multiple Instances

Events are instance-specific:

```php
Event::listen('cart.added', function ($cart, $item) {
    if ($cart->instance === 'wishlist') {
        // Handle wishlist item added
    } elseif ($cart->instance === 'gift') {
        // Handle gift item added
    }
});
```

## Event Data

Each event provides access to the cart instance and the affected item:

```php
Event::listen('cart.added', function ($cart, $item) {
    // Cart instance
    $instance = $cart->instance;
    
    // Item details
    $id = $item->id;
    $name = $item->name;
    $qty = $item->qty;
    $price = $item->price;
    $options = $item->options;
    
    // Cart totals
    $subtotal = $cart->subtotal();
    $tax = $cart->tax();
    $total = $cart->total();
    $count = $cart->count();
});
```

## Next Steps

- [Multiple Instances](/guide/multiple-instances) - Work with multiple cart instances
- [Database Storage](/guide/database-storage) - Implement persistent cart storage
- [Configuration](/guide/configuration) - Configure cart events 