from fastapi import APIRouter, HTTPException
from controllers.sites_controller import SitesController
from models.sites_model import Sites

router = APIRouter()
new_users = SitesController()


@router.get("/get/sites")
async def get_sites():
    rpta = new_users.get_sites()
    return rpta
