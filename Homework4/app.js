import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
let login_or_not = false;
let login_user = "";

db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, title TEXT, body TEXT, time DATETIME DEFAULT CURRENT_TIMESTAMP)");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, password TEXT)");
const router = new Router();

router
  .get('/', list)
  .get('/:user/', userList)
  .get('/:user/post/new', add)
  .get('/:user/post/:id', show)
  .post('/:user/post/', create)
  .get('/signup', signupUi)
  .post('/signup', signup)
  .get('/login', login_Ui)
  .post('/login', login)
  .get('/logout', logout)  

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql) 
{
  let list1 = []

  for (const [id, user, title, body, time] of db.query(sql)) 
  {
    list1.push({id, user, title, body, time});
  }

  return list1;
}

async function list(ctx)
{
  let posts = query("SELECT id, user, title, body, time FROM posts");
  ctx.response.body = await render.list(posts , login_or_not , login_user);
  console.log("posts:", posts);

  /*
  let users = query("SELECT user FROM users");
  ctx.response.body = await render.userList(users);
  */
}

async function userList(ctx) 
{
  const p_user = ctx.params.user.trim();
  let posts = query(`SELECT id, user, title, body, time FROM posts WHERE user = '${p_user}'`);
  let post_count = query(`SELECT COUNT(*) as postCount FROM posts WHERE user = '${p_user}'`);
  ctx.response.body = await render.userList(posts, post_count,p_user);
  
}

async function add(ctx) 
{
  const p_user = ctx.params.user.trim();
  ctx.response.body = await render.newPost(p_user);
}

async function show(ctx) 
{
  const pid = ctx.params.id;
  console.log("pid=" , pid);
  let posts = query(`SELECT id, user, title, body, time FROM posts WHERE id= ${pid}`)
  let post = posts[0]
  console.log('show:post=', posts)
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(post);
}

async function create(ctx) 
{
  const body = ctx.request.body;
  const p_user = ctx.params.user;
  const create_time = new Date().toLocaleString();
  if (body.type() === "form") 
  {
    const pairs = await body.form()
    const post = {}

    for (const [key, value] of pairs) 
    {
      post[key] = value
    }

    console.log('create:post=', post)
    db.query("INSERT INTO posts (user, title, body, time) VALUES (?, ?, ?, ?)", [p_user, post.title, post.body, create_time]);
    ctx.response.redirect(`/${p_user}/`);
  }
}

async function signupUi(ctx)
{
  ctx.response.body = await render.user_register(); 
}

async function signup(ctx) {
  const body = ctx.request.body;

  if (body.type() === "form")
  {
    const pairs = await body.form()
    const user = {}

    for (const [key, value] of pairs) 
    {
      user[key] = value
    }

    console.log("new user:", user);

    db.query("INSERT INTO users (user, password) VALUES (?, ?)", [user.register_user, user.register_password]);

    ctx.response.redirect(`/${user.register_user}/`);
  } 
  else 
  {
    ctx.response.status = 400;
    ctx.response.body = "Expected form data.";
  }
}

async function login_Ui(ctx)
{
  ctx.response.body = await render.user_login(); 
}

async function parseFormBody(body) 
{
  const pairs = await body.form()
  const obj = {}

  for (const [key, value] of pairs) 
  {
    obj[key] = value
  }

  return obj
}

async function login(ctx) 
{
  const body = ctx.request.body;

  if (body.type() === "form")
  {
    var user = await parseFormBody(body)
    console.log('user=', user);
    var db_user = db.query(`SELECT user, password FROM users WHERE user = '${user.register_user}'`);
    console.log("db_user:" , db_user[0][1]);

    if (user.register_password === db_user[0][1])
    {
      login_or_not = true;
      login_user = user.register_user;
      ctx.response.redirect(`/`);
    }
  }
}

async function logout(ctx)
{
  login_or_not = false;
  login_user = "";
  ctx.response.redirect(`/`);
}

console.log(`Server run at http://127.0.0.1:8000`)
await app.listen({ port:8000 });
