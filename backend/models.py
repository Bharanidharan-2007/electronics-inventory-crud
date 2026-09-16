from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class Component(db.Model):
    __tablename__ = 'components'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    date_added = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.UniqueConstraint('name', 'category', name='_name_category_uc'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'quantity': self.quantity,
            'location': self.location,
            'date_added': self.date_added.isoformat() if self.date_added else None
        }
