from pydantic import BaseModel


class Orders(BaseModel):
    idUser: int
    Description: str
    NumberTable: int
    StatusOrder: str
    idSite: int
