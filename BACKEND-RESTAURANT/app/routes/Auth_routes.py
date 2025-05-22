from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel
from config.db_config import get_db_connection
from models.users_model import Users


router = APIRouter()

# Configuración para encriptación de contraseñas

SECRET_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5ODk4NDEwNiwiaWF0IjoxNjk4OTg0MTA2fQ.W3U9ivlk6ZW1qteEuUvGOjUDp8ed20sBNPKDi4rXWE4"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Modelo de usuario para almacenamiento en base de datos


class UsuarioDB(Users):
    hashed_password: str


# Clase de autenticación


class TokenData(BaseModel):
    username: str | None = None

# Obtener usuario de la base de datos


def get_user(db, username: str):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE Email = %s", (username,))
    user = cursor.fetchone()
    if user:
        return user


# Clase para validar contraseñas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Validar contraseña


def verify_password(plain_password, hashed_password):
    if plain_password == hashed_password:
        return True
    else:
        return False

# Crear token JWT


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Ruta de inicio de sesión


@router.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_db_connection()
    user = get_user(db, form_data.username)
    if not user or not verify_password(form_data.password, user['Password']):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['Email']}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# Ruta protegida que requiere autenticación


@router.get("/usuario")
async def obtener_usuario_autenticado(token: str = Depends(OAuth2PasswordBearer(tokenUrl="login"))):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        db = get_db_connection()
        user = get_user(db, username)
        return user
    except JWTError:
        raise HTTPException(
            status_code=401, detail="No se pudo validar el token")
