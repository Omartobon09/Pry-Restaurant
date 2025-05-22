from pydantic import BaseModel


class Products(BaseModel):
    NameProduct: str
    Unit: str
