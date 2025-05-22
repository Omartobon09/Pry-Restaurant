from pydantic import BaseModel


class Users(BaseModel):
    Name: str
    Email: str
    Password: str
    idTypeUser: int
    idSite: int
