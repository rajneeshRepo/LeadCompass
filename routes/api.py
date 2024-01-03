from fastapi import APIRouter
from endpoints import auth, user, sam, validate

router = APIRouter()
router.include_router(auth.router)
router.include_router(user.router)
router.include_router(sam.router)
router.include_router(validate.router)
