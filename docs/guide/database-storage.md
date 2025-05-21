# Database Storage

This guide shows you how to implement persistent cart storage using the database.

## Setup

### Migration

First, publish the migration:

```bash
php artisan vendor:publish --provider="Gloudemans\Shoppingcart\ShoppingcartServiceProvider" --tag="migrations"
```

Then run the migration:

```bash
php artisan migrate
```

This will create the `shopping_cart` table with the following structure:

```php
Schema::create('shopping_cart', function (Blueprint $table) {
    $table->string('identifier');
    $table->string('instance');
    $table->longText('content');
    $table->nullableTimestamps();
    
    $table->primary(['identifier', 'instance']);
});
```

## Basic Usage

### Storing Cart

```php
use Gloudemans\Shoppingcart\Facades\Cart;

// Store the current cart
Cart::store('user_id');

// Store a specific instance
Cart::instance('wishlist')->store('user_id');
```

### Restoring Cart

```php
// Restore the cart
Cart::restore('user_id');

// Restore a specific instance
Cart::instance('wishlist')->restore('user_id');
```

### Erasing Cart

```php
// Erase the cart from storage
Cart::erase('user_id');

// Erase a specific instance
Cart::instance('wishlist')->erase('user_id');
```

## User Integration

### Automatic Storage

To automatically store the cart when a user logs in:

```php
// app/Providers/EventServiceProvider.php
use Illuminate\Auth\Events\Login;

public function boot()
{
    Event::listen(Login::class, function ($event) {
        Cart::restore($event->user->id);
    });
}
```

### Automatic Restoration

To automatically restore the cart when a user logs in:

```php
// app/Providers/EventServiceProvider.php
use Illuminate\Auth\Events\Login;

public function boot()
{
    Event::listen(Login::class, function ($event) {
        Cart::restore($event->user->id);
    });
}
```

## Multiple Instances

### Storing Multiple Instances

```php
// Store all instances
Cart::instance('wishlist')->store('user_id');
Cart::instance('gift')->store('user_id');
Cart::instance('default')->store('user_id');
```

### Restoring Multiple Instances

```php
// Restore all instances
Cart::instance('wishlist')->restore('user_id');
Cart::instance('gift')->restore('user_id');
Cart::instance('default')->restore('user_id');
```

## Cart Model

You can create a model to interact with the stored carts:

```php
// app/Models/StoredCart.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoredCart extends Model
{
    protected $table = 'shopping_cart';
    
    protected $fillable = [
        'identifier',
        'instance',
        'content'
    ];
    
    public function getContentAttribute($value)
    {
        return unserialize($value);
    }
    
    public function setContentAttribute($value)
    {
        $this->attributes['content'] = serialize($value);
    }
}
```

## Custom Storage

You can implement a custom storage driver:

```php
// app/Services/CustomCartStorage.php
namespace App\Services;

use Gloudemans\Shoppingcart\Contracts\Storage;

class CustomCartStorage implements Storage
{
    public function get($identifier)
    {
        // Retrieve cart from custom storage
    }
    
    public function put($identifier, $data)
    {
        // Store cart in custom storage
    }
    
    public function remove($identifier)
    {
        // Remove cart from custom storage
    }
}
```

Register the custom storage:

```php
// config/cart.php
return [
    'storage' => App\Services\CustomCartStorage::class
];
```

## Best Practices

### Regular Storage

Store the cart regularly to prevent data loss:

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\ServiceProvider;
use Gloudemans\Shoppingcart\Facades\Cart;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Store cart every 5 minutes
        $this->app->make('scheduler')->call(function () {
            if (auth()->check()) {
                Cart::store(auth()->id());
            }
        })->everyFiveMinutes();
    }
}
```

### Cleanup

Clean up abandoned carts:

```php
// app/Console/Commands/CleanupCarts.php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoredCart;

class CleanupCarts extends Command
{
    protected $signature = 'cart:cleanup';
    
    public function handle()
    {
        StoredCart::where('updated_at', '<', now()->subDays(30))->delete();
    }
}
```

## Next Steps

- [Events](/guide/events) - Handle cart events
- [Multiple Instances](/guide/multiple-instances) - Work with multiple cart instances
- [Configuration](/guide/configuration) - Configure cart storage 