This commit removes unrequested UI components related to the Profile Orders feature:

- frontend/src/components/order-details-modal.tsx
- frontend/src/components/orders-summary.tsx
- frontend/src/components/orders-debug-info.tsx

The Profile page now:
- Uses the dedicated GET /orders/user/:userId endpoint via useGetUserOrdersQuery
- Displays a simple orders table without debug UI or modal/summary extras

If you want these components back later, they can be reintroduced behind a feature flag.
