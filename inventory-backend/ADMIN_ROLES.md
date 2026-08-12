# Admin and Staff roles

The system now has two roles:

- `admin`: full inventory access, including product deletion.
- `staff`: inventory viewing, adding, and editing; cannot delete products.

Default administrator:
- username: `admin`
- password: `admin123`

- `DELETE /api/products/:id`

The backend enforces these permissions; hiding buttons in the frontend is not the security mechanism.
