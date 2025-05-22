from fastapi import APIRouter
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.orders_model import Orders
from fastapi.encoders import jsonable_encoder
from datetime import datetime


class OrdersController:

    def get_orders(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM orders")
            result = cursor.fetchall()
            payload = []
            content = {}
            for data in result:
                content = {
                    'idOrder': data[0],
                    'idUser': data[1],
                    'Description': data[2],
                    'NumberTable': data[3],
                    'StatusOrder': data[4],
                    'TimeOrder': data[5],
                    'idSite': data[6]

                }
                payload.append(content)
                content = {}
            json_data = jsonable_encoder(payload)
            return {"resultado": json_data}
        except Exception as error:
            return {"resultado": str(error)}

    def get_orders_id(self, idOrder):

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM orders WHERE idOrder = %s", (idOrder,))
            result = cursor.fetchone()
            if result:
                order = {
                    'idOrder': result[0],
                    'idUser': result[1],
                    'Description': result[2],
                    'NumberTable': result[3],
                    'StatusOrder': result[4],
                    'TimeOrder': result[5],
                    'idSite': result[6]
                }
                return {"resultado": order}
            else:
                return {"resultado": "Orden no encontrada"}
        except Exception as error:
            return {"resultado": str(error)}

    def get_order_descripcion_by_id(self, idOrder):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT Description FROM orders WHERE idOrder = %s", (idOrder,))
            result = cursor.fetchone()
            if result:
                product_description = result[0]
                return {"resultado": product_description}
            else:
                return {"resultado": "Producto no encontrado"}
        except Exception as error:
            return {"resultado": str(error)}
        finally:
            cursor.close()
            conn.close()

    def get_pending_orders_today(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            today = datetime.now().date()
            cursor.execute("""
            SELECT * FROM orders 
            WHERE DATE(TimeOrder) = %s 
            AND (StatusOrder = 'Pendiente' OR StatusOrder = 'Listo')
        """, (today,))
            results = cursor.fetchall()
            orders = []
            for result in results:
                order = {
                    'idOrder': result[0],
                    'idUser': result[1],
                    'Description': result[2],
                    'NumberTable': result[3],
                    'StatusOrder': result[4],
                    'TimeOrder': result[5],
                    'idSite': result[6]
                }
                orders.append(order)
            if orders:
                return {"resultado": orders}
            else:
                return {"resultado": "No se encontraron órdenes pendientes hoy"}
        except Exception as error:
            return {"resultado": str(error)}

    def get_completed_orders_today(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            today = datetime.now().date()
            cursor.execute("""
            SELECT * FROM orders 
            WHERE DATE(TimeOrder) = %s 
            AND StatusOrder = 'Entregado'
        """, (today,))
            results = cursor.fetchall()
            orders = []
            for result in results:
                order = {
                    'idOrder': result[0],
                    'idUser': result[1],
                    'Description': result[2],
                    'NumberTable': result[3],
                    'StatusOrder': result[4],
                    'TimeOrder': result[5],
                    'idSite': result[6]
                }
                orders.append(order)
            if orders:
                return {"resultado": orders}
            else:
                return {"resultado": "No se encontraron órdenes Completadas hoy"}
        except Exception as error:
            return {"resultado": str(error)}

    def get_orders_today(self, idUser):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            today = datetime.now().date()
            cursor.execute(
                "SELECT * FROM orders WHERE idUser = %s AND DATE(TimeOrder) = %s", (idUser, today))
            results = cursor.fetchall()
            orders = []
            if results:
                for result in results:
                    order = {
                        'idOrder': result[0],
                        'idUser': result[1],
                        'Description': result[2],
                        'NumberTable': result[3],
                        'StatusOrder': result[4],
                        'TimeOrder': result[5],
                        'idSite': result[6]
                    }
                    orders.append(order)
                return {"resultado": orders}
            else:
                return {"resultado": "No se encontraron órdenes para este usuario hoy"}
        except Exception as error:
            return {"resultado": str(error)}

    def get_orders_for_today(self, id_site):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            today_date = datetime.now().strftime('%Y-%m-%d')
            cursor.execute("""
            SELECT * FROM orders
            WHERE DATE(TimeOrder) = %s
            AND idSite = %s
        """, (today_date, id_site))

            result = cursor.fetchall()

            payload = []
            content = {}
            for data in result:
                content = {
                    'idOrder': data[0],
                    'idUser': data[1],
                    'Description': data[2],
                    'NumberTable': data[3],
                    'StatusOrder': data[4],
                    'TimeOrder': data[5],
                    'idSite': data[6]
                }
                payload.append(content)
                content = {}

            json_data = jsonable_encoder(payload)
            return {"resultado": json_data}
        except Exception as error:
            return {"resultado": str(error)}

    def post_orders(self, neworders: Orders):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            idUser = neworders.idUser
            Description = neworders.Description
            NumberTable = neworders.NumberTable
            idSite = neworders.idSite
            StatusOrder = neworders.StatusOrder if neworders.StatusOrder else "Pendiente"
            cursor.execute("INSERT INTO orders (idUser, Description, NumberTable, StatusOrder, idSite) VALUES (%s, %s, %s, %s, %s)",
                           (idUser, Description, NumberTable, StatusOrder, idSite))
            conn.commit()
            conn.close()
            return {"informacion": "Orden registrada"}
        except Exception as error:
            return {"resultado": str(error)}

    def update_orders(self, idOrder: int, neworders: Orders):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT idOrder FROM orders WHERE idOrder = %s", (idOrder,))
            resultado = cursor.fetchone()
            if not resultado:
                raise HTTPException(
                    status_code=404, detail="La orden no se encuentra en la base de datos")
            idUser = neworders.idUser
            Description = neworders.Description
            NumberTable = neworders.NumberTable
            idSite = neworders.idSite
            StatusOrder = neworders.StatusOrder
            cursor.execute("""
            UPDATE orders SET 
            idUser = %s,
            Description = %s,
            NumberTable = %s,
            idSite= %s,
            StatusOrder = %s
            WHERE idOrder = %s
        """, (idUser, Description, NumberTable, idSite, StatusOrder, idOrder))
            conn.commit()
            return {"informacion": "Orden actualizada"}
        except Exception as error:
            return {"resultado": str(error)}
        finally:
            cursor.close()
            conn.close()

    def delete_orders(self, idOrder: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT idOrder FROM orders WHERE idOrder = %s", (idOrder,))
            resultado = cursor.fetchone()
            if not resultado:
                return {"informacion": "La orden no se encuentra en la base de datos"}
            cursor.execute("DELETE FROM orders WHERE idOrder = %s", (idOrder,))
            conn.commit()
            cursor.close()
            cursor = conn.cursor()
            cursor.execute("ALTER TABLE orders AUTO_INCREMENT = 1")
            conn.commit()
            return {"informacion": "Orden eliminada correctamente"}
        except Exception as error:
            return {"resultado": str(error)}


orders_controller = OrdersController()
