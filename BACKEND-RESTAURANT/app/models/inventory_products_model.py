from pydantic import BaseModel


class InventoryProducts (BaseModel):
    idSite: int
    quantity: int
    idProduct: int
