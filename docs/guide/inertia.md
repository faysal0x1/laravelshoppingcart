# Inertia.js Integration

This guide shows you how to integrate the shopping cart with Inertia.js for a modern, SPA-like experience.

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

### Vue Component

```vue
<!-- resources/js/Pages/Cart/Index.vue -->
<template>
  <div class="cart-container">
    <div v-if="cart.count > 0">
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.rowId" class="cart-item">
          <h3>{{ item.name }}</h3>
          <p>Quantity: {{ item.qty }}</p>
          <p>Price: ${{ item.price }}</p>
          <p>Total: ${{ item.total }}</p>
          
          <p v-if="item.options.size">Size: {{ item.options.size }}</p>
          
          <button @click="removeItem(item.rowId)">Remove</button>
        </div>
      </div>

      <div class="cart-summary">
        <p>Subtotal: ${{ cart.subtotal }}</p>
        <p>Tax: ${{ cart.tax }}</p>
        <p>Total: ${{ cart.total }}</p>
      </div>
    </div>
    <p v-else>Your cart is empty</p>
  </div>
</template>

<script>
import { useForm } from '@inertiajs/vue3'

export default {
  props: {
    cart: Object
  },
  
  setup() {
    const form = useForm({
      rowId: null
    })

    return { form }
  },

  methods: {
    removeItem(rowId) {
      this.form.rowId = rowId
      this.form.delete(route('cart.remove', rowId))
    }
  }
}
</script>
```

## Add to Cart Component

```vue
<!-- resources/js/Components/AddToCart.vue -->
<template>
  <form @submit.prevent="submit">
    <div class="form-group">
      <label for="qty">Quantity</label>
      <input 
        type="number" 
        id="qty" 
        v-model="form.qty" 
        min="1"
      >
    </div>

    <div v-if="product.sizes" class="form-group">
      <label for="size">Size</label>
      <select 
        id="size" 
        v-model="form.options.size"
      >
        <option 
          v-for="size in product.sizes" 
          :key="size" 
          :value="size"
        >
          {{ size }}
        </option>
      </select>
    </div>

    <button type="submit">Add to Cart</button>
  </form>
</template>

<script>
import { useForm } from '@inertiajs/vue3'

export default {
  props: {
    product: Object
  },

  setup(props) {
    const form = useForm({
      id: props.product.id,
      name: props.product.name,
      qty: 1,
      price: props.product.price,
      options: {}
    })

    return { form }
  },

  methods: {
    submit() {
      this.form.post(route('cart.add'))
    }
  }
}
</script>
```

## Cart Counter Component

```vue
<!-- resources/js/Components/CartCounter.vue -->
<template>
  <Link :href="route('cart.index')" class="cart-counter">
    Cart ({{ cartCount }})
  </Link>
</template>

<script>
import { Link } from '@inertiajs/vue3'

export default {
  components: {
    Link
  },
  
  props: {
    cartCount: {
      type: Number,
      required: true
    }
  }
}
</script>
```

## Real-time Updates

To keep the cart counter updated in real-time, you can use Laravel Echo:

```javascript
// resources/js/bootstrap.js
import Echo from 'laravel-echo'

window.Echo.channel('cart')
  .listen('CartUpdated', (e) => {
    // Update cart count in your app
    this.cartCount = e.cartCount
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

## Next Steps

- [API Integration](/guide/api-integration) - Learn how to use the cart in API-based applications
- [Multiple Instances](/guide/multiple-instances) - Work with multiple cart instances
- [Database Storage](/guide/database-storage) - Implement persistent cart storage 