from fastapi import APIRouter, HTTPException
from controllers.typeusers_controller import TypeusersController
from models.users_model import Users

router= APIRouter()
new_typeusers= TypeusersController()

@router.get("/get/typeusers")
async def get_typeusers():
     rpta = new_typeusers.get_typeusers()
     return rpta