export function layout(title, content, body) 
{
    return` 
      <html>
        <head>
          <title>${title}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
          <style>
              body 
              {
              padding: 80px;
              line-height: 2;
              }
          
              h1 
              {
              font-size: 2em;
              }
          
              h2 
              {
              font-size: 1.2em;
              }
          
              #posts 
              {
              margin: 0;
              padding: 0;
              }
          
              #posts li 
              {
              margin: 40px 0;
              padding: 0;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
              list-style: none;
              }
          
              #posts li:last-child 
              {
              border-bottom: none;
              }
          
          </style>
        </head>
        <body style="background-color: rgb(249, 254, 254);">
          <section id="content">
            <div class="container">
              ${content}
              ${body}
            </div>
          </section>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ" crossorigin="anonymous"></script>
        </body>
      </html>
    `
}
  export function list(posts, login_or_not, login_user)
  {
    let listHtml = [];

    for (let post of posts)  
    {
        listHtml.push(`
          <br>
          <div id=.container>
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style="width: 100%;">
                    <div class="container">  
                      <div class="row align-items-center">
                        <div class="col">
                          <p class="lead"  style="font-size: 30px;">#${post.id} &nbsp;<a href="/${post.user}/post/${post.id}"><b>${post.title}</b></a></p>
                        </div>
                        <div class="col">
                          <p style="color: gray; font-size: 20px;">作者 : ${post.user}&nbsp;&nbsp;&nbsp;&nbsp;創建時間 : ${post.time}</a>
                        </div>
                      </div>
                    </div>
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="accordion-body" style="font-size: 20px;">
                    ${post.body}
                  </div>
                </div>
              </div>
            </div>
          </div> 
          `);
    }
    
    if (login_or_not == true)
    {
      return layout
      (
        '', 
        `<div>
          <p class="h1">所有貼文 All Posts</p>
          <br>
          <div>
            <p class="lead">
              Hi,  &nbsp;<mark><strong>${login_user}<strong></mark>&nbsp;&nbsp;&nbsp;
              <a href="/${login_user}/" class="btn btn-outline-success" role="button">My Posts</a>
              <a href="/${login_user}/post/new" class="btn btn-outline-primary" role="button">Create a New Post</a>
              <a href="/logout" class="btn btn-outline-secondary" role="button">Log Out</a>
            </p>
          <div>
          <br>
        </div>`, 
        `<ol style="font-size: 25px;">${listHtml.join('\n')}</ol>`
      );
    }

    else
    {
      return layout
      (
        '', 
        `<div>
          <p class="h1">所有貼文 All Posts</p>
          <br>
          <a href="/login" class="btn btn-outline-info" role="button">Log in</a>
          <a href="/signup" class="btn btn-outline-dark" role="button">Sign up</a>
          <br>
        </div>`, 
        `<ol style="font-size: 25px;">${listHtml.join('\n')}</ol>`
      );
    }
  }  

  export function userList(posts, post_count, post_user) 
  {
    let list = []
    let count = post_count.map(record => (record.id));

    for (let post of posts) 
    {
      list.push(`
        <br>
        <div id=.container>
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style="width: 100%;">
                  <div class="container">  
                    <div class="row align-items-center">
                      <div class="col">
                        <p class="lead"  style="font-size: 30px;">#${post.id} &nbsp;<a href="/${post.user}/post/${post.id}"><b>${post.title}</b></a></p>
                      </div>
                      <div class="col">
                        <p style="color: gray; font-size: 20px;">創建時間 : ${post.time}</a>
                      </div>
                    </div>
                  </div>
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body" style="font-size: 20px;">
                  ${post.body}
                </div>
              </div>
            </div>
          </div>
        </div> 
      `)
    }

    let content = `
    <h1><abbr title="attribute" class="initialism">${post_user}</abbr> 's Posts</h1>
    <p>You have <strong>${count}</strong> posts!</p>
    <p>
      <a href="/${post_user}/post/new" class="btn btn-outline-primary" role="button">Create a Post</a>
      <a href="/" class="btn btn-outline-dark" role="button">Home Page</a>
    </p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
    `

    return layout('Posts', content, "")
  }
  
  export function newPost(user) 
  {
    return layout
    (
        'New Post', `
        <p class="h1">→New Post</p>
        <p class="lead">Create a new post.</p>

        <form action="/${user}/post/" method="post">
          <div class="form-floating">
            <input class="form-control" placeholder="Leave a comment here" id="floatingText" name=title></input>
            <label for="floatingText">Title</label>
          </div>

          <br>

          <div class="form-floating">
            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 300" name=body></textarea>
            <label for="floatingTextarea2">Content</label>
          </div> 

          <br>

          <p>
            <input type="submit" class="btn btn-success" value="Create">
            <a href="/${user}/" class="btn btn-dark" role="button">Back</a>
          </p>
        </form>
        `, ""
    )
  }

  export function show(post) 
  {
    return layout(post.title, `
      <p class="h1">${post.title}</p>
      <h3 style="color:gray; font-size:18px;">${post.time}</h3>
      <hr>
      <pre>${post.body}</pre>
    `, "")
  }

  export function user_register()
  {
    return layout
    (
      "Sign up",
      `<p class="h1">註冊 Sign up</p>
      <br>
      <form action="/signup" method="post">
        <div class="form-floating">
          <input class="form-control" placeholder="Leave a comment here" id="floatingText" name=register_user></input>
          <label for="floatingText">Input Your Name</label>
        </div>

        <br>

        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" name=register_password>
          <label for="floatingPassword">Password</label>
        </div>
        <br>
        <p>
            <input type="submit" class="btn btn-success" value="Sign up">
            <a href="/" class="btn btn-dark" role="button">Back</a>
          </p>
      </form>`,
      ""
    )
  }
  
  export function user_login()
  {
    return layout
    (
      "Log in",
      `<p class="h1">登入 Log in</p>
      <br>
      <form action="/login" method="post">
        <div class="form-floating">
          <input class="form-control" placeholder="Leave a comment here" id="floatingText" name=register_user></input>
          <label for="floatingText">Username</label>
        </div>
        <br>
        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" name=register_password>
          <label for="floatingPassword">Password</label>
        </div>
        <br>
        <p>
            <input type="submit" class="btn btn-success" value="Log in">
            <a href="/" class="btn btn-dark" role="button">Back</a>
          </p>
      </form>`,
      ""
    )
  }
  