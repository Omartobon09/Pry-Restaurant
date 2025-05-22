from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Invoice(BaseModel):
    idInvoice: Optional[int] = None  
    idOrder: int
    TotalAmount: float
    Discount: float
    FinalAmount: float
    PaymentStatus: str
    PaymentDate: datetime
    CreationDate: datetime
    idSite: int
    idUser: int