# Inertia.js React Integration

This guide shows you how to integrate the shopping cart with Inertia.js using React components.

## Basic Setup

### Controller

```php
use Gloudemans\Shoppingcart\Facades\Cart;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        return Inertia::render('Cart/Index', [
            'cart' => [
                'items' => Cart::content(),
                'subtotal' => Cart::subtotal(),
                'tax' => Cart::tax(),
                'total' => Cart::total(),
                'count' => Cart::count()
            ]
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required',
            'name' => 'required',
            'qty' => 'required|numeric|min:1',
            'price' => 'required|numeric|min:0',
            'options' => 'array'
        ]);

        Cart::add($validated);

        return back()->with('success', 'Item added to cart');
    }
}
```

### React Component

```jsx
// resources/js/Pages/Cart/Index.jsx
import { useForm } from '@inertiajs/react'

export default function CartIndex({ cart }) {
  const form = useForm({
    rowId: null
  })

  const removeItem = (rowId) => {
    form.rowId = rowId
    form.delete(route('cart.remove', rowId))
  }

  return (
    <div className="cart-container">
      {cart.count > 0 ? (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.rowId} className="cart-item">
                <h3>{item.name}</h3>
                <p>Quantity: {item.qty}</p>
                <p>Price: ${item.price}</p>
                <p>Total: ${item.total}</p>
                
                {item.options.size && (
                  <p>Size: {item.options.size}</p>
                )}
                
                <button onClick={() => removeItem(item.rowId)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Subtotal: ${cart.subtotal}</p>
            <p>Tax: ${cart.tax}</p>
            <p>Total: ${cart.total}</p>
          </div>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  )
}
```

## Add to Cart Component

```jsx
// resources/js/Components/AddToCart.jsx
import { useForm } from '@inertiajs/react'

export default function AddToCart({ product }) {
  const form = useForm({
    id: product.id,
    name: product.name,
    qty: 1,
    price: product.price,
    options: {}
  })

  const submit = (e) => {
    e.preventDefault()
    form.post(route('cart.add'))
  }

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <label htmlFor="qty">Quantity</label>
        <input 
          type="number" 
          id="qty" 
          value={form.data.qty}
          onChange={e => form.setData('qty', e.target.value)}
          min="1"
        />
      </div>

      {product.sizes && (
        <div className="form-group">
          <label htmlFor="size">Size</label>
          <select 
            id="size" 
            value={form.data.options.size}
            onChange={e => form.setData('options', {
              ...form.data.options,
              size: e.target.value
            })}
          >
            {product.sizes.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit">Add to Cart</button>
    </form>
  )
}
```

## Cart Counter Component

```jsx
// resources/js/Components/CartCounter.jsx
import { Link } from '@inertiajs/react'

export default function CartCounter({ cartCount }) {
  return (
    <Link href={route('cart.index')} className="cart-counter">
      Cart ({cartCount})
    </Link>
  )
}
```

## Real-time Updates

To keep the cart counter updated in real-time, you can use Laravel Echo:

```jsx
// resources/js/bootstrap.js
import Echo from 'laravel-echo'

window.Echo.channel('cart')
  .listen('CartUpdated', (e) => {
    // Update cart count in your app
    setCartCount(e.cartCount)
  })
```

## Cart Events

```php
// CartController.php
public function add(Request $request)
{
    $validated = $request->validate([
        'id' => 'required',
        'name' => 'required',
        'qty' => 'required|numeric|min:1',
        'price' => 'required|numeric|min:0',
        'options' => 'array'
    ]);

    Cart::add($validated);

    // Broadcast cart update
    broadcast(new CartUpdated(Cart::count()))->toOthers();

    return back()->with('success', 'Item added to cart');
}
```

## Styling with Tailwind CSS

```jsx
// resources/js/Pages/Cart/Index.jsx
export default function CartIndex({ cart }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {cart.count > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Shopping Cart
            </h3>
          </div>
          
          <div className="border-t border-gray-200">
            {cart.items.map(item => (
              <div key={item.rowId} className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.qty}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Price: ${item.price}
                    </p>
                    {item.options.size && (
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.options.size}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.rowId)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                <dd className="mt-1 text-sm text-gray-900">${cart.subtotal}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Tax</dt>
                <dd className="mt-1 text-sm text-gray-900">${cart.tax}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="mt-1 text-sm text-gray-900">${cart.total}</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items in cart</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start shopping to add items to your cart.
          </p>
        </div>
      )}
    </div>
  )
}
```

## Next Steps

- [API Integration](/guide/api-integration) - Learn how to use the cart in API-based applications
- [Multiple Instances](/guide/multiple-instances) - Work with multiple cart instances
- [Database Storage](/guide/database-storage) - Implement persistent cart storage 