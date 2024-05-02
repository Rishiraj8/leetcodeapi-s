import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
    DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();



app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: ['http://localhost:5173'],
    allowMethods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
  return await corsMiddleware(c, next)
})




// Define a route for handling POST requests to insert data into the leetcode_users table
app.post('/users/:id', async (c) => {
    const id: string = c.req.param('id');
    try {
        // Insert the data into the leetcode_users table
        await c.env.DB.prepare(
            `INSERT INTO leetcode_users (user_id) VALUES (?)`
        ).bind(id).run();

        // Respond with a success message
        return c.text('User added successfully');
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error inserting user:', error);
        return c.text('Error inserting user');
    }
});

// Define a route for handling GET requests for all usernames
app.get('/users', async (c) => {
    try {
        // Fetch all the usernames from the leetcode_users table
        const queryResult = await c.env.DB.prepare(
            `SELECT user_id FROM leetcode_users`
        ).all();

        // Return the usernames as a JSON response
        return c.json({queryResult});
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error fetching usernames:', error);
        return c.text('Error fetching usernames');
    }
});

// Define a default route
app.get('/', (c) => {
    return c.text('Hello Hono!');
});

export default app;
