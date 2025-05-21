# Multiple Instances

This guide shows you how to work with multiple cart instances in your application.

## Basic Usage

You can create multiple cart instances by specifying a unique name:

```php
use Gloudemans\Shoppingcart\Facades\Cart;

// Create a wishlist cart
Cart::instance('wishlist')->add([
    'id' => '1',
    'name' => 'Product 1',
    'qty' => 1,
    'price' => 10.00
]);

// Create a gift cart
Cart::instance('gift')->add([
    'id' => '2',
    'name' => 'Product 2',
    'qty' => 2,
    'price' => 20.00
]);

// Get items from specific instances
$wishlistItems = Cart::instance('wishlist')->content();
$giftItems = Cart::instance('gift')->content();
```

## Instance Management

### Creating Instances

```php
// Create a new instance
Cart::instance('new-instance');

// Check if instance exists
if (Cart::instance('wishlist')->exists()) {
    // Instance exists
}

// Get all instances
$instances = Cart::instances();
```

### Switching Between Instances

```php
// Switch to wishlist instance
Cart::instance('wishlist');

// Add item to current instance
Cart::add([
    'id' => '3',
    'name' => 'Product 3',
    'qty' => 1,
    'price' => 30.00
]);

// Switch to gift instance
Cart::instance('gift');

// Add item to gift instance
Cart::add([
    'id' => '4',
    'name' => 'Product 4',
    'qty' => 1,
    'price' => 40.00
]);
```

### Instance Operations

```php
// Get instance totals
$wishlistTotal = Cart::instance('wishlist')->total();
$giftTotal = Cart::instance('gift')->total();

// Get instance counts
$wishlistCount = Cart::instance('wishlist')->count();
$giftCount = Cart::instance('gift')->count();

// Clear specific instance
Cart::instance('wishlist')->destroy();

// Remove item from specific instance
Cart::instance('gift')->remove('rowId');
```

## Database Storage

When using database storage, each instance is stored separately:

```php
// Store wishlist in database
Cart::instance('wishlist')->store('user_id');

// Store gift cart in database
Cart::instance('gift')->store('user_id');

// Restore instances from database
Cart::instance('wishlist')->restore('user_id');
Cart::instance('gift')->restore('user_id');
```

## Events

Events are instance-specific:

```php
// Listen for events on specific instance
Event::listen('cart.added', function ($cart, $item) {
    if ($cart->instance === 'wishlist') {
        // Handle wishlist item added
    }
});

// Trigger instance-specific events
Cart::instance('wishlist')->add([
    'id' => '5',
    'name' => 'Product 5',
    'qty' => 1,
    'price' => 50.00
]);
```

## Use Cases

### Wishlist Implementation

```php
class WishlistController extends Controller
{
    public function addToWishlist(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required',
            'price' => 'required|numeric|min:0'
        ]);

        Cart::instance('wishlist')->add([
            'id' => $validated['id'],
            'name' => $validated['name'],
            'qty' => 1,
            'price' => $validated['price']
        ]);

        return back()->with('success', 'Item added to wishlist');
    }

    public function moveToCart($rowId)
    {
        $item = Cart::instance('wishlist')->get($rowId);
        
        Cart::instance('default')->add([
            'id' => $item->id,
            'name' => $item->name,
            'qty' => $item->qty,
            'price' => $item->price,
            'options' => $item->options
        ]);

        Cart::instance('wishlist')->remove($rowId);

        return back()->with('success', 'Item moved to cart');
    }
}
```

### Gift Registry

```php
class GiftRegistryController extends Controller
{
    public function addToRegistry(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|numeric|min:1'
        ]);

        Cart::instance('registry')->add([
            'id' => $validated['id'],
            'name' => $validated['name'],
            'qty' => $validated['quantity'],
            'price' => $validated['price']
        ]);

        return back()->with('success', 'Item added to registry');
    }

    public function purchaseGift($rowId)
    {
        $item = Cart::instance('registry')->get($rowId);
        
        // Process purchase
        // ...

        // Update registry
        Cart::instance('registry')->update($rowId, $item->qty - 1);

        return back()->with('success', 'Gift purchased');
    }
}
```

## Next Steps

- [Database Storage](/guide/database-storage) - Learn about persistent cart storage
- [Events](/guide/events) - Handle cart events
- [Configuration](/guide/configuration) - Configure cart instances 