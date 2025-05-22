import mysql.connector
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.users_model import Users
from fastapi.encoders import jsonable_encoder


class UsersController:

    def get_users(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users")
            result = cursor.fetchall()
            payload = []
            content = {}
            for data in result:
                content = {
                    'idUser': data[0],
                    'Name': data[1],
                    'Email': data[2],
                    'Password': data[3],
                    'idTypeUser': data[4],
                    'idSite': data[5]

                }
                payload.append(content)
                content = {}
            json_data = jsonable_encoder(payload)
            return {"resultado": json_data}
        except Exception as error:
            return {"resultado": str(error)}

    def get_users_id(self, idUser):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE idUser = %s", (idUser,))
            result = cursor.fetchone()
            if result:
                user = {
                    'idUser': result[0],
                    'Name': result[1],
                    'Email': result[2],
                    'Password': result[3],
                    'idTypeUser': result[4],
                    'idSite': result[5]
                }
                return {"resultado": user}
            else:
                return {"resultado": "Usuario no encontrado"}
        except Exception as error:
            return {"resultado": str(error)}

    def post_users(self, newusers: Users):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            Name = newusers.Name
            Email = newusers.Email
            Password = newusers.Password
            idTypeUser = newusers.idTypeUser
            idSite = newusers.idSite
            cursor.execute("INSERT INTO users(Name,Email,Password,idTypeUser,idSite) VALUES (%s,%s,%s,%s,%s)",
                           (Name, Email, Password, idTypeUser, idSite))
            conn.commit()
            conn.close()
            return {"informacion": "Usuario registrado"}
        except Exception as error:
            return {"resultado": str(error)}

    def update_users(self, idUser: int, newusers: Users):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT idUser FROM users WHERE idUser = %s", (idUser,))
            resultado = cursor.fetchone()
            if not resultado:
                raise HTTPException(
                    status_code=404, detail="El usuario no se encuentra en la base de datos")
            Name = newusers.Name
            Email = newusers.Email
            Password = newusers.Password
            idTypeUser = newusers.idTypeUser
            idSite = newusers.idSite
            cursor.execute("""
            UPDATE users SET 
            Name = %s,
            Email = %s,
            Password = %s,
            idTypeUser= %s,
            idSite = %s
            WHERE idUser = %s
        """, (Name, Email, Password, idTypeUser, idSite, idUser))
            conn.commit()
            return {"informacion": "Usuario actualizado"}
        except Exception as error:
            return {"resultado": str(error)}
        finally:
            cursor.close()
            conn.close()

    def delete_users(self, idUser: int):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "SELECT idUser FROM users WHERE idUser = %s", (idUser,))
            resultado = cursor.fetchone()
            if not resultado:
                return {"informacion": "El usuario no se encuentra en la base de datos"}
            cursor.execute(
                "DELETE FROM users WHERE idUser = %s", (idUser,))
            conn.commit()
            cursor.close()
            cursor = conn.cursor()
            cursor.execute("ALTER TABLE users AUTO_INCREMENT = 1")
            conn.commit()
            return {"informacion": "Usuario eliminado"}
        except Exception as error:
            return {"resultado": str(error)}

users_controller = UsersController()