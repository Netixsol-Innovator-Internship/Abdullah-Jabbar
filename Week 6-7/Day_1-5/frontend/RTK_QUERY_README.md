# RTK Query Implementation Guide

This document explains how RTK Query is implemented in the project and how to use it for API calls.

## Overview

RTK Query is an advanced data fetching and caching tool included in the Redux Toolkit. It simplifies data fetching by handling loading states, caching, and updating the server state with minimal boilerplate.

## Project Structure

The RTK Query implementation follows this structure:

```
src/
  lib/
    store.ts                    # Redux store configuration
    api/
      apiSlice.ts              # Base API slice with common configurations
      authApiSlice.ts          # Auth-related endpoints
      productsApiSlice.ts      # Product-related endpoints
      cartApiSlice.ts          # Cart-related endpoints
      ordersApiSlice.ts        # Order-related endpoints
  components/
    ReduxProvider.tsx          # Redux provider for the application
  hooks/
    use-auth-rtk.tsx           # Auth hook using RTK Query
```

## How to Use RTK Query

### 1. Basic Usage

Import the hook from the appropriate API slice and use it in your component:

```tsx
import { useGetProductsQuery } from '@/lib/api/productsApiSlice';

function ProductsList() {
  // The query is automatically executed when the component mounts
  const { data, isLoading, isError, error } = useGetProductsQuery({ page: 1, limit: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div>
      {data?.products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 2. Mutations (for POST, PUT, DELETE operations)

```tsx
import { useAddToCartMutation } from '@/lib/api/cartApiSlice';

function AddToCartButton({ productId }) {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      // The .unwrap() method will return the result or throw an error
      const result = await addToCart({ productId, quantity: 1 }).unwrap();
      console.log('Item added to cart:', result);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### 3. Using Query Parameters

You can pass parameters to your queries:

```tsx
const { data } = useGetProductsQuery({ 
  page: 1, 
  limit: 10,
  category: 'electronics',
  search: 'iphone'
});
```

### 4. Skipping Queries

You can conditionally skip a query:

```tsx
const { data } = useGetProductByIdQuery(productId, {
  skip: !productId  // Skip the query if no productId is provided
});
```

### 5. Refetching Data

To manually refetch data:

```tsx
const { data, refetch } = useGetCartQuery({});

// Later in your code
const handleRefresh = () => {
  refetch();
};
```

### 6. Invalidating Cache

RTK Query automatically invalidates the cache based on the tags provided. For example, when adding a product to the cart, the 'Cart' tag is invalidated, which triggers a refetch of any query that provides the 'Cart' tag.

## Authentication

The authentication is implemented using RTK Query in the `use-auth-rtk.tsx` hook. It handles login, registration, and profile fetching using RTK Query hooks.

Example usage:

```tsx
import { useAuth } from '@/hooks/use-auth-rtk';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await auth.login(email, password);
    if (result.success) {
      // Handle successful login
    } else {
      // Handle error
      console.error(result.error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Example Components

Check out the example components in the project:

- `src/components/examples/ProductListExample.tsx`: Shows how to use RTK Query for product listing and cart operations
- `src/components/examples/AuthExample.tsx`: Demonstrates authentication with RTK Query

## Best Practices

1. **Use the Provided Hooks**: Always use the generated hooks (e.g., `useGetProductsQuery`) instead of creating your own fetch logic.

2. **Handle Loading and Error States**: Always handle the loading and error states returned by RTK Query hooks.

3. **Unwrap Mutations**: Use the `.unwrap()` method with mutations to handle errors properly.

4. **Use Tags for Cache Invalidation**: Define proper tags in your API slices to enable automatic cache invalidation.

5. **Prefer RTK Query over Direct Fetch**: Replace all direct fetch calls with RTK Query to maintain consistency and benefit from built-in caching.
