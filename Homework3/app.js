import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, create_at DATETIME DEFAULT CURRENT_TIMESTAMP)");

const router = new Router();

router
  .get("/", userList)
  .get('/:user/', list)
  .get('/:user/post/new', add)
  .get('/:user/post/:id', show)
  .post('/:user/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) 
{
  let list = []
  for (const [id, title, body, create_at] of db.query(sql, params)) 
  {
    list.push({id, title, body, create_at})
  }
  return list
}

async function userList(ctx)
{
  let posts = query("SELECT id, title, body, create_at FROM posts");
  ctx.response.body = await render.userList(Object.keys(posts))
}

async function list(ctx) 
{
  let posts = query("SELECT id, title, body, create_at FROM posts");
  const user = ctx.params.user;

  if (!posts[user]) posts[user] = [];
  
  console.log('list:posts=', posts[user]);
  ctx.response.body = await render.list(user, posts[user]);
}

async function add(ctx) 
{
  const user = ctx.params.user;
  console.log("add:user=", user);
  ctx.response.body = await render.newPost(user);
}

async function show(ctx) 
{
  const user = ctx.params.user;
  const id = ctx.params.id;

  let posts = query(`SELECT id, title, body, create_at FROM posts WHERE id=?`, [id]);
  let post = posts[0]
  console.log('show:post=', post)

  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(user, post);
}

async function create(ctx) 
{
  const user = ctx.params.user;
  
  try
  {
    const body = ctx.request.body;

    if (body.type === "form") 
    {
      const pairs = await body.form()
      const post = {}

      for (const [key, value] of pairs) 
      {
        post[key] = value
      }

      console.log('create:post=', post)
      db.query("INSERT INTO posts (title, body, create_at) VALUES (?, ?, ?)", [post.title, post.body, new Date().toISOString()]);
      ctx.response.redirect('/');
    }
  }

  catch(err)
  {
    console.error("Error processing from DATA : ", err);
    ctx.throw(500, "Internal Server Error");
  }
}

let port = parseInt(Deno.args[0]) || 8000
console.log(`Server run at http://127.0.0.1:${port}`)
await app.listen({ port });

