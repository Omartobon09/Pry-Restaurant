from fastapi import APIRouter, HTTPException
from controllers.invoices_controller import InvoicesController
from models.invoice_model import Invoice

router = APIRouter()
invoices_controller = InvoicesController()


@router.get("/get/invoice")
async def get_invoices():
    return invoices_controller.get_invoice()


@router.get("/get/invoice/{idInvoice}")
async def get_invoice_by_id(idInvoice: int):
    return invoices_controller.get_invoice_by_id(idInvoice)





@router.post("/post/invoice")
async def create_invoice(new_invoice: Invoice):
    return invoices_controller.create_invoice(new_invoice)


@router.put("/update/invoice/{idInvoice}")
async def update_invoice(idInvoice: int, updated_invoice: Invoice):
    return invoices_controller.update_invoice(idInvoice, updated_invoice)


@router.delete("/delete/invoice/{idInvoice}")
async def delete_invoice(idInvoice: int):
    return invoices_controller.delete_invoice(idInvoice)
