import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.users_routes import router as users_router
from routes.sites_routes import router as sites_router
from routes.typeusers_routes import router as typeusers_router
from routes.orders_routes import router as orders_router
from routes.Auth_routes import router as Auth_router
from routes.products_routes import router as products_router
from routes.inventory_products_routes import router as inventory_products_router
from routes.invoices_routes import router as invoices_router
app = FastAPI()

origins = [
    # "http://localhost.tiangolo.com",
    # "https://localhost.tiangolo.com",
    "http://localhost:3000"
    # "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users_router)
app.include_router(sites_router)
app.include_router(typeusers_router)
app.include_router(orders_router)
app.include_router(Auth_router)
app.include_router(products_router)
app.include_router(inventory_products_router)
app.include_router(invoices_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
