from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.review import Review
from app.models.booking import Booking, BookingStatus
from pydantic import BaseModel, Field
from typing import List, Optional

router = APIRouter()


class ReviewCreate(BaseModel):
    booking_id: int
    target_id: int  # Guide or Company user_id
    rating: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    photos: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    rating: float
    comment: Optional[str]
    helpful_count: int
    created_at: str
    
    class Config:
        from_attributes = True


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_review(review_data: ReviewCreate, db: Session = Depends(get_db)):
    """Create a review for a completed booking"""
    
    # TODO: Get current user from auth
    user_id = 1  # Placeholder
    
    # Check if booking exists and belongs to user
    booking = db.query(Booking).filter(
        Booking.id == review_data.booking_id,
        Booking.user_id == user_id
    ).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.booking_status != BookingStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only review completed bookings"
        )
    
    # Check if review already exists
    existing_review = db.query(Review).filter(
        Review.booking_id == review_data.booking_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already exists for this booking"
        )
    
    # Create review
    new_review = Review(
        booking_id=review_data.booking_id,
        user_id=user_id,
        target_id=review_data.target_id,
        rating=review_data.rating,
        comment=review_data.comment,
        photos=review_data.photos
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return {
        "message": "Review created successfully",
        "review_id": new_review.id
    }


@router.get("/provider/{provider_id}", response_model=List[ReviewResponse])
def get_provider_reviews(provider_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """Get all reviews for a tour guide or company"""
    
    reviews = db.query(Review).filter(
        Review.target_id == provider_id
    ).offset(skip).limit(limit).all()
    
    return reviews


@router.get("/provider/{provider_id}/stats")
def get_provider_review_stats(provider_id: int, db: Session = Depends(get_db)):
    """Get review statistics for a provider"""
    
    from sqlalchemy import func, case
    
    stats = db.query(
        func.count(Review.id).label("total_reviews"),
        func.avg(Review.rating).label("average_rating"),
        func.sum(case((Review.rating == 5, 1), else_=0)).label("five_star"),
        func.sum(case((Review.rating == 4, 1), else_=0)).label("four_star"),
        func.sum(case((Review.rating == 3, 1), else_=0)).label("three_star"),
        func.sum(case((Review.rating == 2, 1), else_=0)).label("two_star"),
        func.sum(case((Review.rating == 1, 1), else_=0)).label("one_star"),
    ).filter(Review.target_id == provider_id).first()
    
    return {
        "total_reviews": stats.total_reviews or 0,
        "average_rating": round(float(stats.average_rating or 0), 2),
        "rating_distribution": {
            "5": stats.five_star or 0,
            "4": stats.four_star or 0,
            "3": stats.three_star or 0,
            "2": stats.two_star or 0,
            "1": stats.one_star or 0,
        }
    }
