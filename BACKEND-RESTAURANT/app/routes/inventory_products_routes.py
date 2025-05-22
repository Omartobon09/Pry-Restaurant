from fastapi import APIRouter, HTTPException
from models.inventory_products_model import InventoryProducts
from controllers.inventory_products_controller import InventoryProductsController

router = APIRouter()
inventory_products_controller = InventoryProductsController()

@router.get("/get/inventory-products")
async def get_inventory_products():
    return inventory_products_controller.get_inventory_products()

@router.get("/get/inventory-products/{id}")
async def get_inventory_product_by_id(id: int):
    return inventory_products_controller.get_inventory_product_by_id(id)

@router.get("/get/inventory-products/{idSite}")
async def get_inventory_products_by_site(idSite: int):
    return inventory_products_controller.get_inventory_products_by_site(idSite)

@router.post("/post/inventory-products")
async def post_inventory_product(new_inventory_product: InventoryProducts):
    return inventory_products_controller.post_inventory_product(new_inventory_product)

@router.put("/update/inventory-products/{id}")
async def update_inventory_product(id: int, new_inventory_product: InventoryProducts):
    return inventory_products_controller.update_inventory_product(id, new_inventory_product)

@router.delete("/delete/inventory-products/{id}")
async def delete_inventory_product(id: int):
    return inventory_products_controller.delete_inventory_product(id)
