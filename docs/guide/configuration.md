# Configuration

The Laravel Shopping Cart package is highly configurable. After publishing the configuration file, you can customize various aspects of the cart's behavior.

## Configuration File

The configuration file is located at `config/cart.php`. Here's a detailed explanation of each option:

```php
return [
    // Tax rate in percentage
    'tax' => 21,
    
    // Number format settings
    'format' => [
        'decimals' => 2,
        'decimal_point' => '.',
        'thousand_separator' => ','
    ],
    
    // Storage driver ('session' or 'database')
    'storage' => 'session',
    
    // Database configuration (used when storage is set to 'database')
    'database' => [
        'connection' => null, // Use default connection
        'table' => 'shopping_cart'
    ]
];
```

## Tax Configuration

The `tax` setting determines the default tax rate applied to cart items. You can change this value to match your business requirements.

```php
'tax' => 21, // 21% tax rate
```

## Number Format

Customize how numbers are formatted in the cart:

```php
'format' => [
    'decimals' => 2,           // Number of decimal places
    'decimal_point' => '.',    // Decimal point character
    'thousand_separator' => ',' // Thousands separator
]
```

## Storage Options

### Session Storage (Default)

The default storage method uses Laravel's session to store cart data:

```php
'storage' => 'session'
```

### Database Storage

To persist cart data across sessions, use database storage:

```php
'storage' => 'database',
'database' => [
    'connection' => null, // Use default database connection
    'table' => 'shopping_cart' // Custom table name
]
```

## Customizing Storage

You can create your own storage driver by implementing the `StorageInterface`:

```php
use Gloudemans\Shoppingcart\Contracts\StorageInterface;

class CustomStorage implements StorageInterface
{
    // Implement required methods
}
```

Then register your custom storage in the service provider:

```php
Cart::setStorage(new CustomStorage());
```

## Next Steps

- [Basic Usage](/guide/basic-usage) - Learn how to use the cart in your application
- [Multiple Instances](/guide/multiple-instances) - Work with multiple cart instances
- [Database Storage](/guide/database-storage) - Implement persistent cart storage 