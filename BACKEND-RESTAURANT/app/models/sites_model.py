from pydantic import BaseModel


class Sites(BaseModel):
    Name: int
    Address: str
