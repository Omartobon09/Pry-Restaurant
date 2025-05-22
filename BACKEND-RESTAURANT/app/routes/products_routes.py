from fastapi import APIRouter, HTTPException
from models.products_model import Products
from controllers.products_controller import ProductsController

router = APIRouter()
products_controller = ProductsController()


@router.get("/get/products",)
async def get_products():
    return products_controller.get_products()


@router.get("/get/products/{idProduct}",)
async def get_product_by_id(idProduct: int):
    return products_controller.get_product_by_id(idProduct)


@router.post("/post/products",)
async def post_product(new_product: Products):
    return products_controller.post_product(new_product)


@router.put("/update/products/{idProduct}",)
async def update_product(idProduct: int, new_product: Products):
    return products_controller.update_product(idProduct, new_product)


@router.delete("/delete/products/{idProduct}",)
async def delete_product(idProduct: int):
    return products_controller.delete_product(idProduct)
