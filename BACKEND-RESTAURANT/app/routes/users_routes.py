from fastapi import APIRouter, HTTPException
from controllers.users_controller import UsersController
from models.users_model import Users

router= APIRouter()
new_users= UsersController()

@router.get("/get/users")
async def get_users():
     rpta = new_users.get_users()
     return rpta

@router.get("/get/users/{idUser}")
async def get_users_id(idUser: int):
    rpta = new_users.get_users_id(idUser)
    return rpta

@router.post("/post/users")
async def post_users(newusers:Users):
 rpta = new_users.post_users(newusers)
 return rpta

@router.put("/update/users/{idUser}")
async def update_users(idUser: int, newusers:Users):
 rpta = new_users.update_users(idUser, newusers)
 return rpta

@router.delete("/delete/users/{idUser}")
async def delete_users(idUser:int):
 rpta = new_users.delete_users(idUser)
 return rpta

   
