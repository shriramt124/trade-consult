from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import BlogPost
from app.schemas import BlogPostListOut, BlogPostOut

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("", response_model=list[BlogPostListOut])
def list_posts(db: Session = Depends(get_db)):
    return db.scalars(
        select(BlogPost)
        .where(BlogPost.is_published.is_(True))
        .order_by(BlogPost.published_at.desc())
    ).all()


@router.get("/{slug}", response_model=BlogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.scalar(
        select(BlogPost).where(
            BlogPost.slug == slug, BlogPost.is_published.is_(True)
        )
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
