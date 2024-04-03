from fastapi import APIRouter
from endpoints import people,organization,search,auth,contact,report,county

router = APIRouter()
router.include_router(people.router)
router.include_router(organization.router)
router.include_router(search.router)
router.include_router(auth.router)
router.include_router(contact.router)
router.include_router(report.router)
router.include_router(county.router)