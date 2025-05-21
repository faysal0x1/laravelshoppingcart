# Blade Templates Integration

This guide shows you how to integrate the shopping cart with Laravel Blade templates.

## Basic Implementation

### Controller

```php
use Gloudemans\Shoppingcart\Facades\Cart;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::content();
        return view('cart.index', compact('cart'));
    }

    public function add(Request $request)
    {
        Cart::add($request->id, $request->name, $request->qty, $request->price);
        return redirect()->back()->with('success', 'Item added to cart');
    }
}
```

### Blade View

```blade
{{-- resources/views/cart/index.blade.php --}}
<div class="cart-container">
    @if(Cart::count() > 0)
        <div class="cart-items">
            @foreach(Cart::content() as $item)
                <div class="cart-item">
                    <h3>{{ $item->name }}</h3>
                    <p>Quantity: {{ $item->qty }}</p>
                    <p>Price: ${{ $item->price }}</p>
                    <p>Total: ${{ $item->total }}</p>
                    
                    @if($item->options->has('size'))
                        <p>Size: {{ $item->options->size }}</p>
                    @endif
                    
                    <form action="{{ route('cart.remove', $item->rowId) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="submit">Remove</button>
                    </form>
                </div>
            @endforeach
        </div>

        <div class="cart-summary">
            <p>Subtotal: ${{ Cart::subtotal() }}</p>
            <p>Tax: ${{ Cart::tax() }}</p>
            <p>Total: ${{ Cart::total() }}</p>
        </div>
    @else
        <p>Your cart is empty</p>
    @endif
</div>
```

## Cart Form Components

### Add to Cart Form

```blade
{{-- resources/views/components/add-to-cart.blade.php --}}
<form action="{{ route('cart.add') }}" method="POST">
    @csrf
    <input type="hidden" name="id" value="{{ $product->id }}">
    <input type="hidden" name="name" value="{{ $product->name }}">
    <input type="hidden" name="price" value="{{ $product->price }}">
    
    <div class="form-group">
        <label for="qty">Quantity</label>
        <input type="number" name="qty" id="qty" value="1" min="1">
    </div>

    @if($product->hasSizes())
        <div class="form-group">
            <label for="size">Size</label>
            <select name="options[size]" id="size">
                @foreach($product->sizes as $size)
                    <option value="{{ $size }}">{{ $size }}</option>
                @endforeach
            </select>
        </div>
    @endif

    <button type="submit">Add to Cart</button>
</form>
```

### Cart Counter Component

```blade
{{-- resources/views/components/cart-counter.blade.php --}}
<div class="cart-counter">
    <a href="{{ route('cart.index') }}">
        Cart ({{ Cart::count() }})
    </a>
</div>
```

## Cart Management

### Update Quantity

```blade
<form action="{{ route('cart.update', $item->rowId) }}" method="POST">
    @csrf
    @method('PATCH')
    <input type="number" name="qty" value="{{ $item->qty }}" min="1">
    <button type="submit">Update</button>
</form>
```

### Remove Item

```blade
<form action="{{ route('cart.remove', $item->rowId) }}" method="POST">
    @csrf
    @method('DELETE')
    <button type="submit">Remove</button>
</form>
```

## Cart Validation

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

    return redirect()->back()->with('success', 'Item added to cart');
}
```

## Cart Events in Blade

```blade
@if(session('cart.added'))
    <div class="alert alert-success">
        {{ session('cart.added') }}
    </div>
@endif

@if(session('cart.updated'))
    <div class="alert alert-info">
        {{ session('cart.updated') }}
    </div>
@endif

@if(session('cart.removed'))
    <div class="alert alert-warning">
        {{ session('cart.removed') }}
    </div>
@endif
```

## Next Steps

- [Inertia.js Integration](/guide/inertia) - Learn how to use the cart with Inertia.js
- [API Integration](/guide/api-integration) - Use the cart in API-based applications
- [Multiple Instances](/guide/multiple-instances) - Work with multiple cart instances 