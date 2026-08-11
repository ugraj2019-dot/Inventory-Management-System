# Admin and Staff roles

The system now has two roles:

- `admin`: full administrative inventory access and user management.
- `staff`: inventory viewing, adding, and editing; cannot delete products or manage users.

Default administrator:
- username: `admin`
- password: `admin123`

Admin-only backend endpoints:
- `GET /api/users`
- `PUT /api/users/:id/role`
- `DELETE /api/users/:id`
- `DELETE /api/products/:id`

The backend enforces these permissions; hiding buttons in the frontend is not the security mechanism.
