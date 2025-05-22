import mysql.connector
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.typeusers_model import Typeusers
from fastapi.encoders import jsonable_encoder


class TypeusersController:

    def get_typeusers(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM typeusers")
            result = cursor.fetchall()
            payload = []
            content = {}
            for data in result:
                content = {
                    'Name': data[1],
                    'Description': data[2]
                }
                payload.append(content)
                content = {}
            json_data = jsonable_encoder(payload)
            return {"resultado": json_data}
        except Exception as error:
            return {"resultado": str(error)}
