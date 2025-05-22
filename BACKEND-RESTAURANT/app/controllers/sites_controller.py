import mysql.connector
from fastapi import HTTPException
from config.db_config import get_db_connection
from models.sites_model import Sites
from fastapi.encoders import jsonable_encoder


class SitesController:

    def get_sites(self):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Sites")
            result = cursor.fetchall()
            payload = []
            content = {}
            for data in result:
                content = {
                    'Name': data[1],
                    'Address': data[2]
                }
                payload.append(content)
                content = {}
            json_data = jsonable_encoder(payload)
            return {"resultado": json_data}
        except Exception as error:
            return {"resultado": str(error)}


sites_controller = SitesController()
