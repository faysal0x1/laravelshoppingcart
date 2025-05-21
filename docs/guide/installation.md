# Installation

## Requirements

- PHP >= 7.4
- Laravel >= 7.0

## Installation via Composer

Install the package through [Composer](http://getcomposer.org/):

```bash
composer require faysal0x1/laravelshoppingcart
```

## Laravel 7.0 Configuration

For Laravel 7.0, you need to manually register the service provider and facade in your `config/app.php` file:

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

## Publishing Configuration

Publish the configuration file:

```bash
php artisan vendor:publish --provider="Gloudemans\Shoppingcart\ShoppingcartServiceProvider"
```

This will create a `config/cart.php` file in your config directory with the following options:

```php
return [
    'tax' => 21, // Tax rate in percentage
    
    'format' => [
        'decimals' => 2,
        'decimal_point' => '.',
        'thousand_separator' => ','
    ],
    
    'storage' => 'session', // 'session' or 'database'
    
    'database' => [
        'connection' => null, // Use default connection
        'table' => 'shopping_cart'
    ]
];
```

## Database Setup (Optional)

If you want to use database storage, publish and run the migrations:

```bash
php artisan vendor:publish --provider="Gloudemans\Shoppingcart\ShoppingcartServiceProvider" --tag="migrations"
php artisan migrate
```

## Next Steps

- [Configuration](/guide/configuration) - Learn how to customize the cart behavior
- [Basic Usage](/guide/basic-usage) - Start using the cart in your application
- [Integration Methods](/guide/) - Choose the best integration method for your needs 