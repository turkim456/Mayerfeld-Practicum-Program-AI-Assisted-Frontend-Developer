# Database schema

The app uses a real PostgreSQL database on Neon.

| Table | Purpose |
| --- | --- |
| dishes | One row per menu item: id, category, name, description, price, image path, image description and dimensions. |
| user | Better Auth's user profile, including name and unique email. |
| account | Better Auth's login credentials linked to a user. Passwords are hashed by the library. |
| session | Better Auth's sessions linked to users, with an expiry time. |
| verification | Better Auth's verification records when a verification flow is used. |

The dish id identifies a menu item. The user id links a profile to its accounts and sessions. Dishes are public menu data and do not need a user id.

Run `npm.cmd run db:setup --workspace server` from the repository root to create missing tables. Better Auth manages its schema through its migration API; `schema.sql` defines only the dishes table. Setup does not seed dishes or create user accounts.
