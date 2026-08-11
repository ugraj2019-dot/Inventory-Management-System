# Registration fixed

Normal registration now works with any username except `admin`.

Start the backend:

```bash
npm install
npm run dev
```

Start the frontend:

```bash
npm install
npm run dev
```

Example new account:

- First name: John
- Last name: Doe
- Username: john
- Password: john123

The new account is saved to SQLite and the user is logged in automatically after registration.

The username `admin` is reserved for:

- Username: admin
- Password: admin123
