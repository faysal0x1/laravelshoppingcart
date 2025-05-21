# API Integration

This guide shows you how to use the shopping cart in API-based applications.

## API Controller Setup

```php
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;

class CartApiController extends Controller
{
    public function index()
    {
        return response()->json([
            'items' => Cart::content(),
            'subtotal' => Cart::subtotal(),
            'tax' => Cart::tax(),
            'total' => Cart::total(),
            'count' => Cart::count()
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

        return response()->json([
            'message' => 'Item added to cart',
            'cart' => [
                'items' => Cart::content(),
                'count' => Cart::count()
            ]
        ]);
    }

    public function update(Request $request, $rowId)
    {
        $validated = $request->validate([
            'qty' => 'required|numeric|min:1'
        ]);

        Cart::update($rowId, $validated['qty']);

        return response()->json([
            'message' => 'Cart updated',
            'cart' => [
                'items' => Cart::content(),
                'count' => Cart::count()
            ]
        ]);
    }

    public function remove($rowId)
    {
        Cart::remove($rowId);

        return response()->json([
            'message' => 'Item removed from cart',
            'cart' => [
                'items' => Cart::content(),
                'count' => Cart::count()
            ]
        ]);
    }

    public function clear()
    {
        Cart::destroy();

        return response()->json([
            'message' => 'Cart cleared',
            'cart' => [
                'items' => Cart::content(),
                'count' => Cart::count()
            ]
        ]);
    }
}
```

## API Routes

```php
// routes/api.php
Route::prefix('cart')->group(function () {
    Route::get('/', [CartApiController::class, 'index']);
    Route::post('/add', [CartApiController::class, 'add']);
    Route::put('/update/{rowId}', [CartApiController::class, 'update']);
    Route::delete('/remove/{rowId}', [CartApiController::class, 'remove']);
    Route::delete('/clear', [CartApiController::class, 'clear']);
});
```

## API Authentication

For authenticated API endpoints, use Laravel Sanctum:

```php
// routes/api.php
Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
    // Cart routes...
});
```

## API Response Format

The API returns consistent JSON responses:

```json
{
    "message": "Operation message",
    "cart": {
        "items": [
            {
                "rowId": "unique_id",
                "id": "product_id",
                "name": "Product Name",
                "qty": 2,
                "price": 10.00,
                "options": {
                    "size": "L"
                },
                "subtotal": 20.00
            }
        ],
        "subtotal": "20.00",
        "tax": "2.00",
        "total": "22.00",
        "count": 1
    }
}
```

## Error Handling

```php
use Illuminate\Validation\ValidationException;

class CartApiController extends Controller
{
    public function add(Request $request)
    {
        try {
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
                    'count' => Cart::count()
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

## API Versioning

For versioned APIs:

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::prefix('cart')->group(function () {
        // Cart routes...
    });
});
```

## API Documentation

Consider using OpenAPI/Swagger for API documentation:

```php
/**
 * @OA\Post(
 *     path="/api/v1/cart/add",
 *     summary="Add item to cart",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"id","name","qty","price"},
 *             @OA\Property(property="id", type="string"),
 *             @OA\Property(property="name", type="string"),
 *             @OA\Property(property="qty", type="integer"),
 *             @OA\Property(property="price", type="number"),
 *             @OA\Property(property="options", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Item added successfully"
 *     )
 * )
 */
```

## Next Steps

- [Multiple Instances](/guide/multiple-instances) - Work with multiple cart instances
- [Database Storage](/guide/database-storage) - Implement persistent cart storage
- [Events](/guide/events) - Handle cart events in your API 