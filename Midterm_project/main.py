from fastapi import FastAPI, Request, Form, HTTPException, Depends, status
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
app = FastAPI()
# app.mount("/static", StaticFiles(directory="static"), name="static")
template = Jinja2Templates(directory="templates")

SQLALCHEMY_DATABASE_URL = "sqlite:///./classeoom.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

now_user = []

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, nullable=False, unique=True)
    student_id = Column(Integer, nullable=False, unique=True)
    password = Column(String(60), nullable=False)
    email = Column(String, nullable=False, unique=True)

class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(Integer, primary_key=True, index=True)
    room = Column(String(4), nullable=False, unique=True)
    name = Column(String, nullable=False, unique=True)
    teacher = Column(String)

class Classroom_Reserve(Base):
    __tablename__ = "classroom_reserve"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    student_name = Column(String, nullable=False)
    classroom = Column(String, nullable=False)
    time = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    check = Column(Boolean)
    false_reason = Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(db: Session, std_id: str, password: str):
    user = db.query(User).filter(User.student_id == std_id).first()
    if (not (user)):
        return None
    if (not (verify_password(password, user.password))):
        return None
    return user

def init_db():
    db = SessionLocal()
    try:
        if (not (db.query(User).filter(User.student_id == 999999999)).all()):
            manager = User(user="manager", student_id=999999999, password=get_password_hash("999999999"), email="jiataiwu84@gmail.com")
            
            db.add(manager)
            db.commit()

        if (not (db.query(Classroom).first())):
            classrooms = [
                Classroom(room="E319", name="數位系統應用實驗室  Digital System Laboratory", teacher="陳正德 老師"),
                Classroom(room="E320", name="多媒體實驗室  Multimedia Laboratory", teacher="陳鍾誠 老師"),
                Classroom(room="E321", name="電腦網路實驗室  Computer Network Laboratory", teacher="柯志亨 老師"),
                Classroom(room="E322", name="嵌入式實驗室  Embedded Laboratory", teacher="趙于翔 老師"),
            ]

            db.add_all(classrooms)
            db.commit()
    finally:
        db.close()

init_db()

@app.get("/" , response_class=HTMLResponse)
async def homepage(request: Request):
    return template.TemplateResponse("index.html" , {"request": request})

@app.get("/signup", response_class=HTMLResponse)
async def signup(request: Request):
    return template.TemplateResponse("signup.html" , {"request": request, "text": None})

@app.post("/signup")
async def signup_ui(request: Request, name: str=Form(...), std_id: int=Form(...), email: str=Form(...), password: str=Form(...), confirm_password: str=Form(...), db: Session = Depends(get_db)):
    user_email = db.query(User).filter(User.email == email).first()
    if (user_email):
        text = "此電子信箱已經註冊 This e-mail already exists."
        return template.TemplateResponse("signup.html", {"request": request, "text": text})
        
    if (password != confirm_password):
        text = "密碼與確認密碼不一致 Password and confirmation password are inconsistent."
        return template.TemplateResponse("login.html", {"request": request, "text": text})
    
    hashed_password = get_password_hash(password)

    db.add(User(user=name, student_id=std_id, password=hashed_password, email=email))
    db.commit()
    return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)

@app.get("/login" , response_class=HTMLResponse)
async def login(request: Request):
    return template.TemplateResponse("login.html", {"request": request, "text": None})

@app.post("/login")
async def login_ui(request: Request, std_id: int=Form(...), password: str=Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.student_id == std_id).first()

    if (not(user)):
        text = "此學號尚未註冊 This student ID has not been registered yet."
        return template.TemplateResponse("login.html", {"request": request, "text": text})

    else:
        user_authenticated = authenticate_user(db, std_id, password)
        if (not(user_authenticated)):
            text = "密碼錯誤 This password is error."
            return template.TemplateResponse("login.html", {"request": request, "text": text})
        
        else:
            if (std_id == 999999999):
                return RedirectResponse(url=f"/{std_id}/admin", status_code=status.HTTP_303_SEE_OTHER)
            else:
                return RedirectResponse(url=f"/{std_id}/classroom", status_code=status.HTTP_303_SEE_OTHER)
            
@app.get("/{std_id}/admin", response_class=HTMLResponse)
async def admin_ui(request: Request, std_id: int, db: Session = Depends(get_db)):
    reservations = db.query(Classroom_Reserve).all()
    return template.TemplateResponse("admin.html", {"request": request, "reservations": reservations, "std_id":std_id})

@app.post("/{std_id}/admin")
async def admin(std_id: int, reserve_id: int=Form(...), outcome: str = Form(...), reject_reason: str = Form(None), db: Session = Depends(get_db)):
    reservation = db.query(Classroom_Reserve).filter(Classroom_Reserve.id == reserve_id).first()

    if outcome == "approved":
        reservation.check = True
        reservation.false_reason = None
    elif outcome == "rejected":
        reservation.check = False
        reservation.false_reason = reject_reason

    db.commit()
    return RedirectResponse(url=f"/{std_id}/admin", status_code=status.HTTP_302_FOUND)

@app.get("/{std_id}/classroom", response_class=HTMLResponse)
async def classroom_ui(request: Request,std_id: int, db: Session = Depends(get_db)):
    classrooms = db.query(Classroom).all()
    return template.TemplateResponse("classroom.html", {"request": request, "std_id": std_id, "classrooms": classrooms})

@app.get("/{std_id}/reserve/{classroom_no}", response_class=HTMLResponse)
async def reserve_ui(request: Request, std_id: int, classroom_no: str, db: Session = Depends(get_db)):
    classroom = db.query(Classroom).filter(Classroom.room == classroom_no).first()
    user = db.query(User).filter(User.student_id == std_id).first()
    return template.TemplateResponse("reserve.html", {"request": request, "classroom": classroom, "user": user})

@app.post("/{std_id}/reserve/{classroom_no}")
async def reserve(classroom_num: str=Form(...), classroom_name: str=Form(...), student_ID: int=Form(...), student_Name: str=Form(...), borrowDate: str=Form(...), borrowTime: str=Form(...), borrowReason: str=Form(...), db: Session = Depends(get_db)):
    classroom = classroom_num + " " + classroom_name
    date = borrowDate + " " + borrowTime
    classroom_reserve = db.query(Classroom_Reserve).filter((Classroom_Reserve.classroom == classroom) & (Classroom_Reserve.time == date)).first()

    if (classroom_reserve):
        return JSONResponse(status_code=400, content={"alert": "該時段已被預約 \nThis time is slot has been reserved."})
    
    db.add(Classroom_Reserve(student_id=student_ID, student_name=student_Name, classroom=classroom, time=date, reason=borrowReason, check=None))
    db.commit()
    return RedirectResponse(url=f"/{student_ID}/classroom", status_code=status.HTTP_303_SEE_OTHER)

@app.get("/{std_id}/history")
async def history_ui(request: Request,std_id: int, db: Session=Depends(get_db)):
    history = db.query(Classroom_Reserve).filter(Classroom_Reserve.student_id == std_id).all()
    
    if (history):
        return template.TemplateResponse("history.html", {"request": request, "user_history": history})
    else:
        return JSONResponse(status_code=400, content={"alert": "該時段已被預約 \nThis time is slot has been reserved."})