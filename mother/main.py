from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()
template = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def homepage(request: Request):
    return template.TemplateResponse("index.html", {"request": request})

@app.post("/submit")
async def handle_login(request: Request, birthday: str = Form(...)):
    if birthday == "20050123":
        return template.TemplateResponse("wish.html", {"request": request})
    else:
        return template.TemplateResponse("error.html", {"request": request})
