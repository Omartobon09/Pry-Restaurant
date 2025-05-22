import mysql.connector
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.invoice_model import Invoice
from fastapi.encoders import jsonable_encoder


class InvoicesController:

    def get_invoice(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM invoices")
            result = cursor.fetchall()
            payload = []
            for data in result:
                invoice = {
                    'idInvoice': data[0],
                    'idOrder': data[1],
                    'TotalAmount': data[2],
                    'Discount': data[3],
                    'FinalAmount': data[4],
                    'PaymentStatus': data[5],
                    'PaymentDate': data[6].isoformat() if data[6] else None,
                    'CreationDate': data[7].isoformat() if data[7] else None,
                    'idSite': data[8],
                    'idUser': data[9]
                }
                payload.append(invoice)
            json_data = jsonable_encoder(payload)
            return {"resultado": json_data}
        except Exception as error:
            return {"resultado": str(error)}

    def get_invoice_by_id(self, idInvoice):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM invoices WHERE idInvoice = %s", (idInvoice,))
            result = cursor.fetchone()
            if result:
                invoice = {
                    'idInvoice': result[0],
                    'idOrder': result[1],
                    'TotalAmount': result[2],
                    'Discount': result[3],
                    'FinalAmount': result[4],
                    'PaymentStatus': result[5],
                    'PaymentDate': result[6].isoformat() if result[6] else None,
                    'CreationDate': result[7].isoformat() if result[7] else None,
                    'idSite': result[8],
                    'idUser': result[9]
                }
                return {"resultado": invoice}
            else:
                return {"resultado": "Factura no encontrada"}
        except Exception as error:
            return {"resultado": str(error)}

    def create_invoice(self, new_invoice: Invoice):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            idOrder = new_invoice.idOrder
            TotalAmount = new_invoice.TotalAmount
            Discount = new_invoice.Discount
            FinalAmount = new_invoice.FinalAmount
            PaymentStatus = new_invoice.PaymentStatus
            PaymentDate = new_invoice.PaymentDate
            CreationDate = new_invoice.CreationDate
            idSite = new_invoice.idSite
            idUser = new_invoice.idUser
            cursor.execute("INSERT INTO invoices(idOrder, TotalAmount, Discount, FinalAmount, PaymentStatus, PaymentDate, CreationDate, idSite, idUser) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                           (idOrder, TotalAmount, Discount, FinalAmount, PaymentStatus, PaymentDate, CreationDate, idSite, idUser))
            conn.commit()
            conn.close()
            return {"informacion": "Factura creada"}
        except Exception as error:
            return {"resultado": str(error)}

    def update_invoice(self, idInvoice: int, updated_invoice: Invoice):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT idInvoice FROM invoices WHERE idInvoice = %s", (idInvoice,))
            result = cursor.fetchone()
            if not result:
                raise HTTPException(
                    status_code=404, detail="La factura no se encuentra en la base de datos")
            idOrder = updated_invoice.idOrder
            TotalAmount = updated_invoice.TotalAmount
            Discount = updated_invoice.Discount
            FinalAmount = updated_invoice.FinalAmount
            PaymentStatus = updated_invoice.PaymentStatus
            PaymentDate = updated_invoice.PaymentDate
            CreationDate = updated_invoice.CreationDate
            idSite = updated_invoice.idSite
            idUser = updated_invoice.idUser
            cursor.execute("""
            UPDATE invoices SET 
            idOrder = %s,
            TotalAmount = %s,
            Discount = %s,
            FinalAmount = %s,
            PaymentStatus = %s,
            PaymentDate = %s,
            CreationDate = %s,
            idSite = %s,
            idUser = %s
            WHERE idInvoice = %s
        """, (idOrder, TotalAmount, Discount, FinalAmount, PaymentStatus, PaymentDate, CreationDate, idSite, idUser, idInvoice))
            conn.commit()
            return {"informacion": "Factura actualizada"}
        except Exception as error:
            return {"resultado": str(error)}
        finally:
            cursor.close()
            conn.close()

    def delete_invoice(self, idInvoice: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT idInvoice FROM invoices WHERE idInvoice = %s", (idInvoice,))
            result = cursor.fetchone()
            if not result:
                return {"informacion": "La factura no se encuentra en la base de datos"}
            cursor.execute(
                "DELETE FROM invoices WHERE idInvoice = %s", (idInvoice,))
            conn.commit()
            cursor.close()
            return {"informacion": "Factura eliminada"}
        except Exception as error:
            return {"resultado": str(error)}


invoices_controller = InvoicesController()
