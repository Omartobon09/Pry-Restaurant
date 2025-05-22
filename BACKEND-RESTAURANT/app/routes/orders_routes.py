from fastapi import APIRouter, HTTPException
from controllers.orders_controller import OrdersController
from models.orders_model import Orders
from datetime import date


router = APIRouter()
new_orders = OrdersController()

# traer todas las ordenes


@router.get("/get/orders")
async def get_orders():
    rpta = new_orders.get_orders()
    return rpta

# trae ordenes por idOrder


@router.get("/get/orders/{idOrder}")
async def get_orders_id(idOrder: int):
    rpta = new_orders.get_orders_id(idOrder)
    return rpta

# trae las ordenes que estan pendientes del dia actual


@router.get("/get/orders/status/pending")
async def get_pending_orders_today():
    result = new_orders.get_pending_orders_today()
    return result

# trae las ordenes que estan completas del dia actual


@router.get("/get/orders/status/entregado")
async def get_completed_orders_today():
    result = new_orders.get_completed_orders_today()
    return result


# trae las ordenes del mesero del dia actual


@router.get("/get/orders/today/{idUser}")
async def get_orders_today(idUser: int):
    rpta = new_orders.get_orders_today(idUser)
    return rpta


# trae las ordenes del dia actual por idsite


@router.get("/get/orders/today/sites/{idSite}")
async def get_orders_for_today(idSite: int):
    rpta = new_orders.get_orders_for_today(idSite)
    return rpta

@router.post("/post/orders")
async def post_orders(neworders: Orders):
    result = new_orders.post_orders(neworders)
    return result


@router.put("/update/orders/{idOrder}")
async def update_order(idOrder: int, neworders: Orders):
    result = new_orders.update_orders(idOrder, neworders)
    return result


@router.delete("/delete/orders/{idOrder}")
async def delete_order(idOrder: int):
    result = new_orders.delete_orders(idOrder)
    return result

@router.get("/get/order/description/{idOrder}")
async def get_order_descripcion_by_id(idOrder: int):
    result = new_orders.get_order_descripcion_by_id(idOrder)
    return result
